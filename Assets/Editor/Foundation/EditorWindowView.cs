using UnityEditor;
using UnityEngine;

namespace KBNEditor.Foundation
{
    public abstract class EditorWindowView<W> : IEditorWindowView where W : EditorWindow
    {
        protected W window;

        public EditorWindowView(W window)
        {
            if (window == null)
            {
                throw new UnityException("Window cannot be null");
            }

            this.window = window;
        }

        public virtual void OnEnter() {}

        public virtual void OnLeave() {}

        public abstract void Draw();
    }
}
