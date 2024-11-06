"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BannerProps {
    documentId: Id<"documents">;
}

export const Banner = ({
    documentId
}: BannerProps) => {

    const router = useRouter();
    const remove = useMutation(api.documents.remove);
    const restore = useMutation(api.documents.restore);

    const onRemove = async () => {
        try {
            await toast.promise(
                remove({ id: documentId }), 
                {
                    loading: "Deleting document...",
                    success: "Document deleted successfully",
                    error: "Failed to delete document"
                }
            );
            router.push("/documents");
        } catch (error) {
            console.error("Failed to delete document:", error);
        }
    };

    const onRestore = async () => {
        try {
            await toast.promise(
                restore({ id: documentId }), 
                {
                    loading: "Restoring document...",
                    success: "Document restored successfully",
                    error: "Failed to restore document"
                }
            );
        } catch (error) {
            console.error("Failed to restore document:", error);
        }
    };

    return (
        <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
            <p>This page is in the Trash</p>
            <Button 
                size="sm"
                onClick={onRestore}
                variant="outline"
                className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
            >
                Restore Page
            </Button>
            <ConfirmModal onClick={onRemove}>
                <Button 
                    size="sm"
                    variant="outline"
                    className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
                >
                    Delete forever
                </Button>
            </ConfirmModal>
        </div>
    );
};
