namespace KBNEditor.Foundation
{
    public interface IEditorWindowView : IEditorDrawable
    {
        void OnEnter();
        void OnLeave();
    }
}
