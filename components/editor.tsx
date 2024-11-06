import { useTheme } from "next-themes";
import {
    BlockNoteEditorOptions,
    BlockNoteEditor,
    PartialBlock
} from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import {
    BlockNoteViewProps,
    useCreateBlockNote
} from "@blocknote/react";
import "@blocknote/core/style.css";
import { useEdgeStore } from "@/lib/edgestore"; // Import the useEdgeStore hook from your project
import { any } from "zod";

interface EditorProps {
    onChange: (value: string) => void;
    initialContent?: string;
    editable?: boolean;
}

export const Editor = ({
    onChange,
    initialContent,
    editable = true // Setting default value to true for editable
}: EditorProps) => {
    const { resolvedTheme } = useTheme();

    const { edgestore } = useEdgeStore(); // Use the useEdgeStore hook

    const handleUpload = async (file: File) => {
        const response = await edgestore.publicFiles.upload({ file });
        // handle the response as needed
    }

    const editorOptions: BlockNoteEditorOptions = {
        initialContent: initialContent
            ? (JSON.parse(initialContent) as PartialBlock[])
            : undefined
    };

    const editor: BlockNoteEditor = useCreateBlockNote(editorOptions);

    return (
        <div>
            {editable ? (
                <BlockNoteView
                    editor={editor}
                    theme={resolvedTheme === "dark" ? "dark" : "light"}
                    editable
                />
            ) : (
                <BlockNoteView
                    editor={editor}
                    theme={resolvedTheme === "dark" ? "dark" : "light"}
                    editable={false}
                />
            )}
        </div>
    );
}
