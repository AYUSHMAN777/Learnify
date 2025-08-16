import React from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

/**
 * Custom RichTextEditor for CourseTab
 * Props:
 *   input: state object containing description field
 *   setInput: setState function to update input object
 *   placeholder, className: optional
 */
const RichTextEditor = ({
  input,
  setInput,
  placeholder = "Write something...",
  className = "",
}) => {
  const handleChange = (val) => {
    setInput((prev) => ({
      ...prev,
      description: val || "",
    }));
  };

  return (
    <div
      className={className}
      style={{
        background: "#fff",
        borderRadius: 8,
        padding: 4,
      }}
      data-color-mode="light"
    >
      <MDEditor
        value={input?.description || ""}
        onChange={handleChange}
        placeholder={placeholder}
        height={250}
        data-color-mode="light"
      />
    </div>
  );
};

export default RichTextEditor;