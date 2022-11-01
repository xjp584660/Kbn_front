namespace KBN {

	public abstract class TileInfoPopUp : UIObject {
		public interface TileInfoPopUpListener{
			void onTileInfoPopUpDismiss();
		}

		public TileInfoPopUpListener listener;

		public abstract void display(HashObject obj, UnityEngine.Texture tileTex);
		public abstract void setupAVATileInfo( PBMsgAVATileInfo.PBMsgAVATileInfo a );
		public abstract void setTileSharedOK();
		public abstract void dismiss();

		// temporary for MapController migration, TODO remove these if possible
		public abstract float getBGLabelHeight();

		public abstract bool getIsMyCarmot();
		public abstract bool getIsSameAllianceCarmot();
		public abstract bool getIsStrangerCarmot();
		public abstract void setRallyAttack();
		public abstract void resetRallyAttack();
	}


}