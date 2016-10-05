import {
	P2I
} from "../engine/Collision";
import GunDrawer from "./Drawer/GunDrawer";
import Victor from "../engine/Victor";
import Bullet from "./Bullet";
import Ship from "./Ship";
import TWEEN from "../../class/Tween";
const Easing = TWEEN.Easing;

import {
	L_ANI_TIME,
	B_ANI_TIME,
	M_ANI_TIME,
	S_ANI_TIME,
	pt2px,
	mix_options,
	assign,
	_isBorwser,
	_isNode,
	transformJSON,
	transformValue,
	transformMix,
} from "../const";
import * as gunShape from "./gunShape.json";
if(_isNode) {
    Object.assign(gunShape, transformJSON(JSON.stringify(gunShape)));
}

export interface GunConfig {
	// 基本属性
	size ?: number 
	rotation ?: number
	//战斗相关的状态
	is_firing ? : boolean
	ison_BTAR ? : boolean // 是否处于攻击钱摇

	// 战斗相关的属性
	bullet_size ?: number 
	bullet_force ? : number
	bullet_damage ? : number
	bullet_penetrate ? : number // 穿透，意味着子弹存在时间
	overload_speed ? : number // 攻速

	// 枪基本形状
	type ? : string
}
export default class Gun extends P2I {
	static TYPES = gunShape
	owner: Ship = null
	gun: PIXI.Graphics = new PIXI.Graphics()
	config:GunConfig = {
		rotation : 0,
		//战斗相关的状态
		is_firing : false,
		ison_BTAR : false, // 是否处于攻击钱摇

		// 战斗相关的属性
		bullet_size: pt2px(5),
		bullet_force : 1,
		bullet_damage : 1,
		bullet_penetrate : 1, // 穿透，意味着子弹存在时间
		overload_speed : 1, // 攻速

		// 枪基本形状
		type : "NONE"
	}
	constructor(new_config: GunConfig = {}, owner ? : Ship) {
		super();
		const self = this;
		self.owner = owner;
		// const config = self.config;
		self.setConfig(new_config);

		if (owner) {
			owner.guns.push(self);
			owner.addChild(self);
		}

		// if (_isBorwser) {
		// 	self.gun.cacheAsBitmap = true;
		// }

		// 攻速限制
		(function() {
			var before_the_attack_roll_ani = 0.5; // 攻击前腰在整个动画时间的占比
			var acc_overload_time = 0;
			self.once("fire_start", function _fire_start() {
				const config = self.config;
				config.is_firing = true;
				config.ison_BTAR = true;
				// 射击相关的动画，不加锁，但可以取消（暂时没有想到取消前腰会有什么隐患，所以目前做成可以直接取消）
				// 射击钱摇枪管不可转向。 = true;
				var overload_ani = 1000 / config.overload_speed;
				var _update = function(delay) {
					acc_overload_time += delay;
					if (acc_overload_time >= overload_ani * before_the_attack_roll_ani) {
						config.ison_BTAR = false;
						if (acc_overload_time >= overload_ani) {
							self.emit("fire_end");
							acc_overload_time -= overload_ani;
						}
					}
				};
				self.on("update", _update);
				self.once("fire_end", function() {
					config.is_firing = false;
					self.off("update", _update);
					self.once("fire_start", _fire_start);
				});
				// 浏览器端要加动画
				if (_isBorwser) {
					self.emit("fire_ani");
				}
			});

			// 射击相关的动画，不加锁，但可以取消（暂时没有想到取消前腰会有什么隐患，所以目前做成可以直接取消）
			// 射击钱摇枪管不可转向。
			self.on("fire_ani", function _fire_ani() {
				self.emit("cancel_fire_ani");

				const config = self.config;
				var acc_fire_time = 0;
				var overload_ani = 1000 / config.overload_speed;
				var from_gun_x = self.x;
				var from_gun_y = self.y;
				var dif_gun_x =  -self.width / 2;
				var dif_gun_y = 0;
				if(config.rotation) {
					var dir_vic = new Victor(dif_gun_x,dif_gun_y);
					dir_vic.rotate(config.rotation);
					dif_gun_x = dir_vic.x;
					dif_gun_y = dir_vic.y;
				}
				var to_gun_x = from_gun_x + dif_gun_x;
				var to_gun_y = from_gun_y + dif_gun_y;

				var _update = function(delay) {
					acc_fire_time += delay;
					var _progress = acc_fire_time / overload_ani;
					var ani_progress = Math.min(Math.max(_progress, 0), 1);
					// 动画分两段
					if (ani_progress <= before_the_attack_roll_ani) { //第一段，缩进去
						ani_progress /= before_the_attack_roll_ani;
						ani_progress = Easing.Elastic.Out(ani_progress)
						self.x = from_gun_x + dif_gun_x * ani_progress;
						self.y = from_gun_y + dif_gun_y * ani_progress;
					} else { //第二段，复原
						ani_progress = (ani_progress - before_the_attack_roll_ani) / (1 - before_the_attack_roll_ani);
						ani_progress = Easing.Sinusoidal.Out(ani_progress)
						self.x = to_gun_x - dif_gun_x * ani_progress;
						self.y = to_gun_y - dif_gun_y * ani_progress;
					}

					if (_progress >= 1) {
						self.emit("cancel_fire_ani");
					}
				};
				self.on("update", _update);
				self.once("cancel_fire_ani", function() {
					self.x = from_gun_x;
					self.once("fire_ani", _fire_ani);
					self.off("update", _update);
				});
			});
		}());
	}
	setConfig(new_config){
		const self = this;
		const config = self.config;
		var typeInfo = gunShape[new_config.type]||gunShape[config.type];
		if (!typeInfo) {
			throw new TypeError("UNKONW Gun Type: " + config.type);
		}

		const owner = self.owner;
		const owner_config = owner.config;

		// 动态合成配置
		new_config = transformMix(owner_config, new_config)
		typeInfo = transformMix(owner_config, typeInfo)

		if (new_config["args"]) { // 飞船绘制配置强制覆盖枪杆配置
			typeInfo = assign(assign({}, typeInfo), {
				args: new_config["args"]
			})
		}
		// 覆盖配置
		mix_options(config, typeInfo["config"]);
		mix_options(config, new_config);
		// 绘制枪体
		GunDrawer(self, config, typeInfo);
		// 在射击动画结束的时候重置坐标，否则，原本射击的动画会影响绘制结果
		var new_x = self.x;
		var new_y = self.y;
		self.once("cancel_fire_ani",function () {
			self.x = new_x;
			self.y = new_y;
		});
	}
	update(delay){
		this.emit("update", delay);
	}
	fire() {
		const ship = this.owner;
		const ship_config = ship.config;
		const config = this.config;
		if (config.is_firing) {
			return
		}
		this.emit("fire_start");
		var bullet_size = config.bullet_size;
		var bullet_force = new Victor(ship_config.bullet_force, 0);
		var bullet_start = new Victor(ship_config.size + bullet_size / 2, 0);
		var bullet_dir = ship_config.rotation + config.rotation;
		bullet_force.rotate(bullet_dir);
		bullet_start.rotate(bullet_dir);
		var bullet = new Bullet({
			team_tag: ship_config.team_tag,
			x: ship_config.x + bullet_start.x,
			y: ship_config.y + bullet_start.y,
			x_force: bullet_force.x,
			y_force: bullet_force.y,
			size: bullet_size,
			damage: config.bullet_damage,
			penetrate: config.bullet_penetrate,
		}, this);

		bullet.p2_body.velocity = ship.p2_body.velocity.slice();

		// 一旦发射，飞船受到后座力
		bullet.once("add-to-world", () => {
			var mass_rate = bullet.p2_body.mass / ship.p2_body.mass;
			// 飞船自身提供给子弹大量的初始推动力
			var init_x_force = bullet_force.x * 50;
			var init_y_force = bullet_force.y * 50;
			bullet.p2_body.force = [init_x_force, init_y_force];

			ship.p2_body.force[0] -= init_x_force * mass_rate;
			ship.p2_body.force[1] -= init_y_force * mass_rate;
		});
		return bullet;
		// config.firing
	}
}