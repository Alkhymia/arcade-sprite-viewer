"use strict"

var palsetAddress = [
	0x2E152, 0x2E152, 0x2E152, 
	// 0x2E67E, 0x2E67E, 0x2E67E, 
	// 0x2E85C, 0x2E85C,
	// 0xF7126, 0xF7126,			// level 2
	// 0x2E94C, 0x2E94C,
	// 0x2EB38,
	// 0x287EE, 0x287EE,			// level 3
	// 0x2ED16, 0x2ED16,
	// 0x2F09C, 0x2F09C, 0x2F09C,
	// 0x337D6,
	// 0x2F41C, 0x2F41C, 0x2F41C,
	// 0x2F672, 0x2F672,
	// 0x2FA26, 0x2FA26, 0x2FA26,
	// 0x2FDAC, 0x2FDAC, 0x2FDAC,	// level 4
	// 0x3627A, 0x3627A,
	//0x545D4, 0xC8374, 0xCAEAA, 0x55482, 0x566CA, 0x57CEC, 0x545D4, 0x4E226, 0x545D4
];

// load pal from rom and oveewrite old
function loadRomPal() {
	var bf = getrdbuf();

	mslugPalette(0x4626);		// ROM:000046CE
	mslugPalette(0x46A8);		// ROM:0000470E
	mslugPalette(palsetAddress[palset]);

	palette_empty = paletted_start;	// dynamic palette

	mslugPalette2(0x8A9);
	mslugPalette2(0x8AB);

	// var playerPalette = 0x90E54;

	// mslugPalette2(bf.getuShort(playerPalette));
	// mslugPalette2(bf.getuShort(playerPalette + 2));
	// mslugPalette2(bf.getuShort(playerPalette + 4));
	// mslugPalette2(bf.getuShort(playerPalette + 6));

	// mslugPalette2(0x125);
	// mslugPalette2(0x3BE);

	// mslugPalette2(0x7A);
	// mslugPalette2(0x7C);
	// mslugPalette2(0x7E);
	// mslugPalette2(0x80);

	// mslugPalette2(0x38D);
	// mslugPalette2(0x3AA);
	// mslugPalette2(0x200);
	
	if(showPal)
		drawPal();
}

function mslugPalette(addr) {
	for(let p = 0;p < 0x100;p++) {
		let idx2 = bfr.getuShort(addr);		// write to
		if(idx2 == 0xFFFF) {
			break;
		}
		let idx = bfr.getShort(addr + 2);

		mslugPaletteBase(idx, idx2 * 0x10)

		addr += 6;
	}
}

var paletted_start = 0x70
var palette_empty;
// palette not fixed in position
function mslugPalette2(addr) {
	mslugPaletteBase(addr, palette_empty * 0x10)
	palette_empty++;
}

function mslugPaletteBase(idx, to) {
	var rombase = unscramble(0x0904);
	var bf2 = getrdbuf();

	idx <<= 5;
	let addr2 = 0x200000 + idx + rombase;
	bf2.position(addr2);

	palData[to] = 0;
	bf2.skip(2);

	for(let i = 0;i < 15;i++) {
		let dt = bf2.getuShort() << 1;
		if(dt > 0x8000) {	// signed because ROM:000809EE    move.w  (a3,d0.w),(a4)+
			dt -= 0x10000;
		}
		let addr3 = 0x220000 + dt + rombase;		
		let color = bfr.getuShort(addr3);
		palData[i + to + 1] = neo2rgb(color);
	}

	palette_empty++;
}

function movetoTile(tile) {
	curStartTile = tile;
	refresh()
}

var animAddress = [
	[0x3D69A6,0x9D0], [0x37B9C6,0x9D0], 0x3968C0, [0x396D10,0x38D], [0x396DE0,0x38D], 0x396E64, 0x396ECA, 0x3c6164,
	[0x3B3A5C,0x8A9,0xB2F52] , [0x3B3682,0x8A9,0xB2F52], [0x3b4218,0x8A8],	// crab
	0x3d7786, 0x3dab1e, 0x3c6618,
	0x37ae5e, 0x37c696, 0x3b66f8, 0x37c418,
	[0x321868,0x855], [0x32001a], [0x328788],
	0x3db0ee, 0X3DAB1E, 0X347FAE, 0x3486cc,
	[0x37B63A, 0x9EE], [0x37B70E, 0x9EE], [0x37B778, 0x9EE],		// debris
	[0x3B5D96, 0x8E3, 0xA64A4],	0x3B5E4A, 0x3B63A2, 0x3B621E, 0x3B5FC4, [0x3B5F02], // boss 1	   
	[0x370414, 0x375, 0x85CB2], 0x36A7EA, 0x36BC1C, 0x36D04E, 0x36B168, 0x37841C, 0x3784BA, 0x36C59A, 0x36ACFA,		// tank
	0x36C12C, 0x36B678, 0x36CAAA, 0x378CA2, 0x370000, 0x3725D6, 0x372C6E, 0x372E34, 0x371BFE, 0x371C60, 0x371CA2, 0x372104, [0x37A99E, 0x363],		// tank
	[0x38d584, 0xA7A], 0x38D45E, 0x38D632, 0x38D774, 0x38D538, 0x38DA9E, 0x38D8CA,		// robot
	[0x3A0202, 0X1D9], 0x3A0184, 0x3A007E, 0x3A00FC, 0x3A0000, 0x3A0014, 0x3A0396, 0x3A0300, 0x3A1490, 0x3A143E,	// sub
	[0x38DD0A, 0x88D], 0x38E0AE, 0x38E452, 0x38DD74,		// ???
	[0x3c3a52, 0x15A], 0x3C3702, // copter
	[0x3C08B6, 0x83A], 0x3C095C,
	[0x3CB598, 0x244], 0x3CB64C, 0x3CB5F4,
	[0x3CE8F8, 0x1C], 0x3CE9A4,
	[0x3CF0CC, 0x8dd], 0x3CEE6C, 0x3CEF04, 0x3CEF50,
	[0x3BB400, 0xA4B], 0x3BB31E, 0x3BB2E6, 0x3BB3BE, 0x3BB78C,
];
var curAnim;	// cur	rent animation index
var curAnimAct;	// current animation index
// show object animation from rom address
var animTimer;
function drawAnimation(addr) {
	animCB = null;
//	let addr = animAddress[curAnim];
	var bf = getrdbuf();
	if(!addr) {
		addr = animAddress[curAnim];
		if(typeof addr !== 'number') {
			animCB = addr[2];
			if(palsetSpr) {
				mslugPaletteBase(palsetSpr, paletted_start * 0x10);
			} else {
				mslugPaletteBase(addr[1], paletted_start * 0x10);
				palsetSpr = addr[1];
			}
			addr = addr[0];
		}
	}
	if(animTimer) {
		clearTimeout(animTimer)
		animTimer = null;
	}

	addr = translate(addr);
	
	loopDrawAnimation(addr);
}
var animCB;	// for cb saving in animation
function loopDrawAnimation(addr, base = addr) {
	animTimer = null;

	var bf = getrdbuf(addr);

	for(let i = 0;i < 10;i++) {
		let animfunc = bf.get();		// ROM:0001B85C anim_func:
		if(animfunc == 4) {			// render a sprite
			addr = bf.position() + 7;	// addr = next time from this address
			break;
		} else if(animfunc == 0x8) {	// jump to another animation
			let d1 = bf.get();
			let link = bf.getInt();
			addr = translate(link);
			bf.position(addr);
		} else if(animfunc == 0xC) {	// jump to another animation
			let d1 = bf.get();
			let d0 = bf.getShort();
			let link = bf.getInt();
			if(curAnimAct > 0) {
				addr = translate(link);
				bf.position(addr);
			}
		} else if(animfunc == 0x10) {	// render a sprite based on direction then go on
			let d0 = bf.get();
			let d1 = bf.getShort();
			addr = bf.position() + d1;
			bf.move(curAnimAct << 3);		// sprite for different directions (like tank)
			bf.skip();
			break;
		} else if(animfunc == 0x14) {	// invoke code
			bf.skip(9);
		} else if(animfunc == 0x20) {	// has more to do but...
			let prop = bf.get();
			let data = bf.getInt();
			if(prop == 0x50) {
				// change collision box
				animCB = data;
			}
		} else if(animfunc == 0x0) {
			// addr = base;
			// bf.position(addr);
			bf.skip(1);	
		} else if(animfunc == 0x28) {	// restart
			addr = base;
			bf.position(addr);
		} else if(animfunc == 0x2C) {	// jump
			let d0 = bf.get();
			let d2 = bf.getShort();
			let d3 = bf.getrShort(curAnimAct << 1);
			bf.move(d3 + d2);
		} else if(animfunc == 0x18 || animfunc == 0x1C || animfunc == 0x30) {
			bf.skip(3);
		} else if(animfunc == 0x24) {		// ROM:0001BB5A    subq.b  #1,(a6,d0.w)
			bf.skip(1);	
		} else {
			labelInfo.innerText = 'unsupport: anim:' + (addr).toString(16).toUpperCase() + ' func:' + animfunc.toString(16).toUpperCase();
			return;
		}
	}
	let tmp = bf.get();
	tmp = bf.get();
	tmp = bf.get();
	let addr2 = bf.getInt();
	let frame = getRomFrame(addr2);
	if(animCB) {
		frame.cb1 = getCB(animCB);
	}
	if(!frame) {
		return;
	}
	labelInfo.innerText = 'anim:' + (addr).toString(16).toUpperCase();

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawRomFrameBase(frame);
	// addr +=  0xA;

	animTimer = setTimeout("loopDrawAnimation("+ addr +"," + base + ")", 200);
}
function getCB(addr) {
	if(!addr) {
		return null;
	}
	var bf = new bytebuffer(romFrameData, addr);
	return {
		x : bf.getShort(),
		y : bf.getShort(),
		x2 : bf.getShort(),
		y2 : bf.getShort(),
	}
}

function drawAnimationFrame(addr, c = ctx, offx = 128, offy = 160, cbbase = 0x103000) {

}


var bgAddress = [
	0x2E014, 0x2E05E, 0x2E0A8,	// level 1
	// 0x2E560, 0x2E5BE, 0x2E622,
	// 0x2E806, 0x2E82E,
	// 0xF6FD2, 0xF7052,			// level 2
	// 0x2E912, 0x2E92C,
	// 0x2EB0E,
	// 0x287B4, 0x287CE,			// level 3
	// 0x2ECCE, 0x2ECE8,
	// 0x2EF04, 0x2EF50, 0x2EFBE,
	// 0x337A8,
	// 0x2F3C8, 0x2F3E2, 0x2F3FC,
	// 0x2F56C, 0x2F5EC,
	// 0x2F98E, 0x2F9CA, 0x2F9E4,
	// 0x2FCBC, 0x2FBF8, 0x2FD34,	// level 4
	// 0x36238, 0x3625A,			// level 5
	//0x54574, 0xC82AC, 0xCAC6A, 0x55452, 0x56638, 0x58BD6, 0x549A2, 0x4E1D0, 0xC7A5A
];

let bgWidth = 32;
let bgHeight;	// default 8
let bgGrid = 2;		// each map tile contains 4 raw tiles?
// draw a background with tilemap

function drawbg() {
	palset = curbg;
	loadRomPal();

	var bf = getrdbuf();
	let addr = bgAddress[curbg] + bgScene * 12;	// bgAddressSkip

	let countdown = bgScene;
	let addr2, offset, w, h, saveaddr;	// save addr for display
	let nextbg;	// next background in the same scene
	bf.position(addr);
	for(let j = 0;j < 10;j++) {
		let func = bf.getShort();
		if(func == 0) {
			let tmp1 = bf.getShort();
			nextbg = bf.getShort();
		} else if(func == 0x4) {
			saveaddr = bf.position();
			addr2 = bf.getShort();
			offset = bf.getuShort();
			bf.skip(4);
			w = bf.getShort();
			h = bf.getShort();
			let tmp1 = bf.getInt();
			if(addr2 == 0) {		// skip this
				continue;
			}
			if(--countdown < 0) {
				break;	// found a background
			}
		} else {
			labelInfo.innerText += ' bg not found';
			return;
		}
	}


	
	addr2 = (addr2 << 3) + 0x1002;
	let page = bf.getuShort(addr2);	// memory page
	let addr3 = bf.getInt(addr2 + 2) + unscramble(page);

	if(h > 0x100) {	// too 
		debugger;
		return;
	}

	labelInfo.innerText += ' '+ w + 'x' + h + ' addr:' + saveaddr.toString(16).toUpperCase();

	drawbgbasemslug(addr3 + offset, w, h);
}


function setMapTileStart(bgstart) {
	bgScene = bgstart;
	refresh();
}


frameAddress = [		// bp 331C get D4
	0x33C34, 0x33CEA, 0x33D96, 0x33E6A,
];

// get frame from addr. return a frame obj
function getRomFrame(addr, f) {
	var bf = getrdbuf();
	var bf2 = getrdbuf();
	let frame = {
		sprites: [],
	};
	
	let addr2, offset;
	if(f >= 0) {
		bf.position(addr + f * 10);
		addr2 = bf.getShort();
		offset = bf.getuShort();	// memory page
	} else {
		addr2 = (addr & 0x7FFFFF) >> 16;
		offset = addr & 0xFFFF;
	}

	addr2 = (addr2 << 3) + 0x1002;
	let page = bf.getuShort(addr2);
	let poffset = unscramble(page);
	addr = bf.getInt(addr2 + 2) + poffset + offset;


	frame.info = '0x'+addr.toString(16).toUpperCase();

	bf.position(addr);
	let cnt = bf.get();	// sprite count
	if(cnt > 0x10) {
		debugger;
		return;
	}
	let flag = bf.get();
	let palette = paletted_start;

	for(let c = 0;c < cnt;c++) {
		
		let x = bf.getShort();
		let y = -bf.getShort();
		let nx = bf.get();
		let ny = bf.get();
		//let d0 = bf.getuShort();
	
		for(let i = 0;i < nx;i++) {
			for(let j = 0;j < ny;j++) {
				let tile = bf.getuShort() + ((flag & 0xF0) << 12);
				let sprite = {
					x: (i << 4) + x,
					y: (j << 4) + y,
					tile: tile,
					nx: 1,
					ny: 1,
					vflip: flag & 0x2,	// this tile need flip
					hflip: flag & 0x1,	// this tile need flip
					pal: palette,
				};
				frame.sprites.push(sprite);
			}
		}
	}

	return frame;
}

var animPlayerAddr = [];

var palmap = [

];

var levelAddress = 0xECE2C;	// all level data begin here
function loadRomFrame() {
	var bf = getrdbuf();
	var bf2 = getrdbuf();
	
	// for(let i = 0;i < 21;i++) {
	// 	let addr = bf.getInt(0x120280 + i * 4);
	// 	frameAddress.push(addr);
	// 	// if(palmap[i])
	// 	// 	spritePaletteMap.set(addr, palmap[i]);
	// }

	// load level data to palette and map
	// palsetAddress = [];
	// bgAddress = [];
	for(let s = 0;s < 5;s++) {
		let sceneAddr = bf.getInt(levelAddress + s * 4);	// all scenes are linked together
		bf.position(sceneAddr + 2);
		for(let i = 0;i < 100;i++) {
			let offset = bf.getShort();
			if(offset == 0) {
				break;
			}
			let nextScene = bf.position() + offset;
			let funcScene = bf.get();
			bf.skip();
	
			let dataaddr = bf.getInt();
			bf2.position(dataaddr);
	
			let palette;
			for(let j = 0;j < 100;j++) {
				let func = bf2.getShort();
				if(func == -1) {
					break;
				} else if(func == 0x28) {		// end of level data?
					let status = bf2.getShort();
					if(status > 0) {
						break;
					}
				} else if(func == 0x2C) {
					let status = bf2.getShort();
					if(status > 0) {
						break;
					}
					bf2.skip(4);
				} else if(func == 0x4) {
					palette = bf2.getInt();
				} else if(func == 0x24) {
					let x = bf2.getShort();
					let bg = bf2.getInt();
					palsetAddress.push(palette);
					bgAddress.push(bg);
				} else if(func == 0x34 || func == 0x40 || func == 0x3C || func == 0x48 || func == 0x20) {
					bf2.skip(2);
				} else if(func == 0x14 || func == 0x18) {
					bf2.skip(6);
				} else if(func == 0x0 || func == 0x30 || func == 0x38) {
					bf2.skip(8);
				} else if(func == 0x8 || func == 0x10 || func == 0x4C || func == 0x44 || func == 0xC || func == 0x1C) {
					bf2.skip(4);
				} else {
					labelInfo.innerText = 'unknown func 0x' + func.toString(16).toUpperCase() + ' at ' +
						(bf2.position()-2).toString(16).toUpperCase();
					debugger
					break;
				}
			}
	
			bf.position(nextScene);
		}
	}
	maxbg = bgAddress.length;

	var lastpal, lastcb;
	for(let [i, c] of animAddress.entries()) {
		if(typeof c !== 'number') {
			if(c.length > 1) {
				lastpal = c[1];
			} else {
				c[1] = lastpal;
			}
			if(c.length > 2) {
				lastcb = c[2];
			} else {
				c[2] = lastcb;
			}
		} else {
			animAddress[i] = [c, lastpal, lastcb];
		}
	}
}


function unscramble(sel) {
	var bankoffset =
	[
		0x000000, 0x020000, 0x040000, 0x060000, // 00
		0x070000, 0x090000, 0x0b0000, 0x0d0000, // 04
		0x0e0000, 0x0f0000, 0x120000, 0x130000, // 08
		0x140000, 0x150000, 0x180000, 0x190000, // 12
		0x1a0000, 0x1b0000, 0x1e0000, 0x1f0000, // 16
		0x200000, 0x210000, 0x240000, 0x250000, // 20
		0x260000, 0x270000, 0x2a0000, 0x2b0000, // 24
		0x2c0000, 0x2d0000, 0x300000, 0x310000, // 28
		0x320000, 0x330000, 0x360000, 0x370000, // 32
		0x380000, 0x390000, 0x3c0000, 0x3d0000, // 36
		0x400000, 0x410000, 0x440000, 0x450000, // 40
		0x460000, 0x470000, 0x4a0000, 0x4b0000, // 44
		0x4c0000, // rest not used?
	];

	// unscramble bank number
	let data =
		(BIT(sel, 14) << 0)+
		(BIT(sel, 12) << 1)+
		(BIT(sel, 15) << 2)+
		(BIT(sel,  6) << 3)+
		(BIT(sel,  3) << 4)+
		(BIT(sel,  9) << 5);

	return -0x100000 + bankoffset[data];
}

function BIT(sel, n) {
	return (sel >> n) & 1;
}

function translate(addr) {
	let addr2 = (addr & 0x7FFFFF) >> 16;
	let offset = addr & 0xFFFF;

	addr2 = (addr2 << 3) + 0x1002;
	let page = bfr.getuShort(addr2);
	let poffset = unscramble(page);
	return bfr.getInt(addr2 + 2) + poffset + offset;
}