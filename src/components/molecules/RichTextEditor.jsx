import { useRef } from 'react';
import './RichTextEditor.css';

const RichTextEditor = ({ value, onChange, placeholder = 'Escribe aquí...' }) => {
  const editorRef = useRef(null);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => execCommand('bold')}
            title="Negrita (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => execCommand('italic')}
            title="Cursiva (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => execCommand('underline')}
            title="Subrayado (Ctrl+U)"
          >
            <u>U</u>
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => execCommand('formatBlock', '<h2>')}
            title="Título 1"
          >
            H1
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => execCommand('formatBlock', '<h3>')}
            title="Título 2"
          >
            H2
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => execCommand('formatBlock', '<p>')}
            title="Párrafo"
          >
            P
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => execCommand('insertUnorderedList')}
            title="Lista con viñetas"
          >
            <span>•</span> Lista
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => execCommand('insertOrderedList')}
            title="Lista numerada"
          >
            1. Lista
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => execCommand('justifyLeft')}
            title="Alinear izquierda"
          >
            ≡
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => execCommand('justifyCenter')}
            title="Alinear centro"
          >
            ≣
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => {
              const url = prompt('Ingresa la URL:');
              if (url) execCommand('createLink', url);
            }}
            title="Insertar enlace"
          >
            🔗
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => execCommand('removeFormat')}
            title="Limpiar formato"
          >
            ✖
          </button>
        </div>
      </div>

      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
