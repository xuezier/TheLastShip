import p2 from "./lib/p2";
import {
    P2I
} from "../../../web-server/app/engine/Collision";
// import Bullet from "./class/Bullet";
import Wall from "../../../web-server/app/class/Wall";
import Flyer from "../../../web-server/app/class/Flyer";
import Bullet from "../../../web-server/app/class/Bullet";

import Ship, {
    ShipConfig
} from "../../../web-server/app/class/Ship";
import {
    VIEW
} from "./common";

const world: p2.World = new p2.World({
    gravity: [0, 0]
});
const worldStep = 1 / 60;

const _runNarrowphase = world.runNarrowphase;
world.runNarrowphase = function(np, bi, si, xi, ai, bj, sj, xj, aj, cm, glen) {
    // 如果si是飞船，无视同组的 普通子弹
    if (si["ship_team_tag"] &&
        si["ship_team_tag"] === sj["bullet_team_tag"]) {
        return;
    }
    // 同理sj
    if (sj["ship_team_tag"] &&
        sj["ship_team_tag"] === si["bullet_team_tag"]) {
        return;
    }
    // 如果是同队子弹，无视碰撞
    if(si["bullet_team_tag"] &&
        si["bullet_team_tag"] === sj["bullet_team_tag"]) {
        return
    }
    return _runNarrowphase.call(this, np, bi, si, xi, ai, bj, sj, xj, aj, cm, glen);
};
// 计算穿透
function emit_penetrate(bullet:Bullet,obj:P2I) {
    if(obj.config.team_tag === bullet.config.team_tag) {
        // 同组暂时不检查，获取可以有合击技能
    }else{
        if(obj instanceof Wall) {// 遇到墙，削弱20%的伤害
            bullet.emit("penetrate", obj, bullet.config.damage * obj.config.bulletproof);
            bullet.emit("in-wall", obj);
        }else{
            bullet.emit("penetrate", obj)
        }
    }
};
// world.on("impact", function(evt) {

// });
world.on("beginContact",function(evt){
    var p2i_A = All_body_weakmap.get(evt.bodyA);
    var p2i_B = All_body_weakmap.get(evt.bodyB);
    if(!(p2i_A&&p2i_B)) {
        return
    }
    // console.log("beginContact",p2i_A,p2i_B);
    if(p2i_A instanceof Bullet) {
        var impact_bullet = p2i_A;
        emit_penetrate(p2i_A, p2i_B);
        var impact_obj = p2i_B;
    }
    if(p2i_B instanceof Bullet){
        var impact_bullet = p2i_B;
        emit_penetrate(p2i_B, p2i_A);
        var impact_obj = p2i_A;
    }
    if(impact_obj) {
        // 同组判定
        if (impact_obj.config.team_tag &&
            impact_obj.config.team_tag === impact_bullet.config.team_tag) {
            return;
        }
        impact_obj.emit("change-hp", -impact_bullet.config.damage,
            // 子弹 - 枪支 - 飞船
            impact_bullet.owner.owner);
    }
});
world.on("endContact",function (evt) {
    var p2i_A = All_body_weakmap.get(evt.bodyA);
    var p2i_B = All_body_weakmap.get(evt.bodyB);
    if(!(p2i_A&&p2i_B)) {
        return
    }
    if(p2i_A instanceof Bullet&&p2i_B instanceof Wall) {
        p2i_A.emit("out-wall");
    }
    if(p2i_B instanceof Bullet&&p2i_A instanceof Wall) {
        p2i_B.emit("out-wall");
    }
});


const All_body_weakmap = new WeakMap<p2.Body,P2I>();
const All_id_map = new Map<string,P2I>();

// TODO 使用数据库？
const ship_md5_id_map = new Map<string,string>();
const ship_id_md5_map = new Map<string,string>();

const p2is = [];
export const engine = {
    world: world,
    listener:null,
    emit(eventName,...args){
        engine.listener&&engine.listener.emit(eventName,...args);
    },
    add(item: P2I) {
        if (item instanceof Bullet) {
            ["explode"].forEach(eventName=>{
                item.on(eventName,function () {
                    engine.emit(eventName, this);
                });
            })
        }else if(item instanceof Ship){
            ["die", "change-hp"].forEach(eventName=>{
                item.on(eventName,function () {
                    engine.emit(eventName, this);
                });
            });
            // 来自于枪支冒泡的发射动画
            item.on("gun-fire_start",function(gun_id, bullet) {
                engine.emit("gun-fire_start", {
                    gun_id: gun_id,
                    bullet: bullet,
                    ship_id: this._id
                });
            })
            item.on("destroy",function () {
                var ship_id = this._id;
                var ship_md5_id = ship_id_md5_map.get(ship_id);
                ship_md5_id_map.delete(ship_md5_id);
                ship_id_md5_map.delete(ship_id)
            });
        }else if(item instanceof Flyer){
            ["ember", "change-hp"].forEach(eventName=>{
                item.on(eventName,function () {
                    engine.emit(eventName, this);
                });
            });
        }

        p2is.push(item);
        All_body_weakmap.set(item.p2_body, item);
        All_id_map.set(item._id, item);
        item.emit("add-to-world", world);
        item.on("destroy", function() {
            console.log("destroy!!and remove!!",p2is.indexOf(this))
            p2is.splice(p2is.indexOf(this), 1);
            All_body_weakmap.delete(this.p2_body);
            All_id_map.delete(this._id);
        });
    },
    getGameBaseInfo(){
        return {
            rank: [],
        }
    },
    getRectangleObjects(x: number, y: number, width: number, height: number) {
        return p2is;
    },
    update(delay: number) {
        world.step(worldStep, delay / 100, 10);
        p2is.forEach(p2i => p2i.update(delay));
    },
    newShip(ship_config?: ShipConfig) {
        var default_ship_config = {
            x: 50+(VIEW.WIDTH-100) * Math.random(),
            y: 50+(VIEW.HEIGHT-100) * Math.random(),
            body_color: 0x777777 * Math.random(),
            team_tag: Math.random()
        };
        ship_config = ship_config ? Object.assign(ship_config, default_ship_config):default_ship_config;
        var new_ship = new Ship(ship_config);
        engine.add(new_ship);
        if(ship_config["ship_md5_id"]) {
            ship_md5_id_map.set(ship_config["ship_md5_id"],new_ship._id);
            ship_id_md5_map.set(new_ship._id, ship_config["ship_md5_id"]);
        }
        return new_ship;
    },
    getShip(ship_md5_id){
        var ship_id = ship_md5_id_map.get(ship_md5_id);
        return ship_id && All_id_map.get(ship_id);
    },
    setConfig(ship_id, new_ship_config:ShipConfig){
        var current_ship = <Ship>All_id_map.get(ship_id);
        if(!(current_ship instanceof Ship)) {
            throw `SHIP ID NO REF INSTANCE:${ship_id}`;
        }
        current_ship.operateShip(new_ship_config);
        return current_ship;
    },
    fire(ship_id){
        var current_ship = <Ship>All_id_map.get(ship_id);
         if(!(current_ship instanceof Ship)) {
            throw `SHIP ID NO REF INSTANCE:${ship_id}`;
        }
        var bullets = current_ship.fire();
        if(bullets.length) {
            bullets.forEach(function (bullet) {
                engine.add(bullet)
            });
        }
        return bullets;
    },
    autoFire(ship_id){
        var current_ship = <Ship>All_id_map.get(ship_id);
         if(!(current_ship instanceof Ship)) {
            throw `SHIP ID NO REF INSTANCE:${ship_id}`;
        }
        current_ship.toggleKeepFire(function (bullets) {
            bullets.forEach(bullet => {
                engine.add(bullet);
            });
        });
    },
    addProto(ship_id, add_proto){
        var current_ship = <Ship>All_id_map.get(ship_id);
         if(!(current_ship instanceof Ship)) {
            throw `SHIP ID NO REF INSTANCE:${ship_id}`;
        }
        try{
            current_ship.addProto(add_proto);
        }catch(e){
            // console.log(e);
        }
        return current_ship.proto_list;
    },
    changeType(ship_id, new_type){
        var current_ship = <Ship>All_id_map.get(ship_id);
         if(!(current_ship instanceof Ship)) {
            throw `SHIP ID NO REF INSTANCE:${ship_id}`;
        }
        current_ship.changeType(new_type);
        return current_ship;
    },
};
// 材质信息
// 通用物体与通用物体
world.addContactMaterial(new p2.ContactMaterial(P2I.material, P2I.material,{
    restitution : 0.0,
    stiffness : 500,    // This makes the contact soft!
    relaxation : 0.1
}));
// 子弹与子弹、墙、通用物体，体现穿透性
world.addContactMaterial(new p2.ContactMaterial(Bullet.material, Bullet.material,{
    restitution : 0.0,
    stiffness : 200,    // This makes the contact soft!
    relaxation : 0.2
}));
// 子弹与子弹、墙、通用物体，体现穿透性
world.addContactMaterial(new p2.ContactMaterial(Bullet.material, Wall.material,{
    restitution : 0.0,
    stiffness : 10,    // 对于子弹穿透，墙体现低折射率，但会削弱子弹上海
    relaxation : 0.5
}));
// 子弹与子弹、墙、通用物体，体现穿透性
world.addContactMaterial(new p2.ContactMaterial(Bullet.material, P2I.material,{
    restitution : 0.0,
    stiffness : 200,    // This makes the contact soft!
    relaxation : 0.2
}));