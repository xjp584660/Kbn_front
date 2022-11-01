using UnityEngine;
using System.Collections;
using System.Collections.Generic;


namespace KBN
{

	public abstract class ChatRotator : PopMenu {

		[SerializeField] 
		private ScrollList scrollList;
		[SerializeField]
		private RotatorItem noticeTemplate;

		
		[SerializeField]
		private SimpleLabel frame;
		[SerializeField]
		private SimpleLabel lbImageBg;

		[SerializeField]
		private SimpleLabel lbDetail;
		[SerializeField]
		private SimpleButton btnView;

		private List<Notice> list = null;
		private int lastPage = -1;
		
		protected const string urlPrefix = "url:";

		public override void Init ()
		{
			base.Init ();
			
			//frame.setBackground("notice", TextureType.DECORATION);
			lbImageBg.setBackground("black_mask_round_corner", TextureType.DECORATION);
			title.txt = Datas.getArString("Common.Notice");

			btnView.EnableBlueButton(true);
			btnView.txt = Datas.getArString("Common.View");
			btnView.OnClick = new System.Action(OnViewButton);
		}

		public override void OnPush (object param)
		{
			base.OnPush (param);

			scrollList.Init(noticeTemplate);
			lbDetail.txt = string.Empty;

			Notice initNotice = param as Notice;

			list = ChatNotices.instance().GetNoticesList();
			scrollList.SetData(list);
			scrollList.ResetPos();

			if (null != initNotice && null != list)
			{
				for (int i = 0; i < list.Count; i++)
				{
					if (initNotice.SaleId == list[i].SaleId)
					{
						scrollList.SetToPage(i);
						break;
					}
				}
			}

			lastPage = -1;
		}

		public override void Update ()
		{
			base.Update ();
			scrollList.Update();

			int curPage = scrollList.CurrentPage();
			if (curPage >= 0 && curPage < list.Count && curPage != lastPage)
			{
				lastPage = curPage;

				lbDetail.txt = list[lastPage].Detail;
			}
			btnView.SetVisible(scrollList.IsIdle() && !string.IsNullOrEmpty(list[lastPage].Destination));
		}
		
		public override void OnPopOver ()
		{
			base.OnPopOver ();
			scrollList.Clear();
			list = null;
		}

		protected override void DrawItem ()
		{
			base.DrawItem ();
			
			lbImageBg.Draw();

			scrollList.Draw();
			lbDetail.Draw();
			btnView.Draw();

			frame.Draw();
		}

		private void OnViewButton()
		{
			if (lastPage < 0 || lastPage >= list.Count) return;

			View(list[lastPage]);
		}

		protected abstract void View(Notice notice);
	}

}