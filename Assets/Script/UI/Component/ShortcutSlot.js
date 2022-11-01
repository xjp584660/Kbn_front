class ShortcutSlot extends ListItem
{

	public function Init()
	{
		description.rect.width = this.rect.width - btnSelect.rect.width;
		description.rect.height = this.rect.height;

		btnSelect.rect.x = this.rect.width - btnSelect.rect.width;
		btnSelect.rect.height = this.rect.height;
		btnSelect.Init();
	}

	public function willBeRemoved():boolean
	{
		return !visible;
	}
	public function Draw()
	{
		GUI.BeginGroup(rect);
		description.Draw();
		btnSelect.Draw();
		GUI.EndGroup();
	}	
		
}

