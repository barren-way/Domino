import TipPop from "./TipPop"
import Manager from "../Engine/Manager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Dialog {
	public static TYPE_TIP: number = TipPop.TYPE_DIALOG_TIP;
	public static TYPE_TIP_S: number = TipPop.TYPE_DIALOG_TIP_S;
	public static TYPE_ONE_BTN: number = TipPop.TYPE_DIALOG_ONE_BTN
	public static TYPE_TWO_BTN: number = TipPop.TYPE_DIALOG_TWO_BTN
	public static TYPE_NET_TIMEOUT: number = TipPop.TYPE_DIALOG_NET_TIMEOUT
	public static TYPE_TWOPLUS_BTN: number = TipPop.TYPE_DIALOG_TWOPLUS_BTN
	public static TYPE_INVITE: number = TipPop.TYPE_DIALOG_INVITE

	private static sTag: number = 1;
	private static dialogs: { [key: number]: any } = {};

	public static init(): void {
		TipPop.createData();
	}

	public static show(dType: number, info: string, callBack?: Function, delay?: number) {
		Dialog.sTag = Dialog.sTag + 1;
		let tag = Dialog.sTag;
		tag = tag + 1;
		if (tag > 10000000) {
			tag = 1;
		}
		Dialog.sTag = tag;
		let pop = new TipPop();
		if (pop.show({ dType: dType, info: info, callBack: callBack, delay: delay })) {
			let node = Manager.getInstance().getRootNode();
			pop.zIndex = cc.macro.MAX_ZINDEX - 1;
			pop.Tag = tag;
			node.addChild(pop);
			this.dialogs[tag] = pop;
		}
		return pop
	}

	public static clear(dtype?) {
		let dialogs = this.dialogs
		if (dtype) {
			for (const tag in dialogs) {
				if (dialogs[tag] && dialogs[tag].Type == dtype) {
					this.hide(tag, true)
				}
			}
		} else {
			for (const tag in dialogs) {
				this.hide(tag, true)
			}
			this.dialogs = {}
		}
	}

	public static hide(tag, uncall?: any) {
		let dialog = this.dialogs[tag];
		if (dialog) {
			if (dialog.hide(uncall)) {
				this.dialogs[tag] = null
			}
		}
	}
}