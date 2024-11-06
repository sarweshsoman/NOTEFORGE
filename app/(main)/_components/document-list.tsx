"use client"

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Item } from "./item"
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";



interface DocumentListProps {
    parentDocumentId?: Id<"documents">;
    level?: number;
    data?: Doc<"documents">[];
    router: any; // Change the type according to your router object type
}

export const DocumentList = ({
    parentDocumentId,
    level = 0,
    
}: DocumentListProps) => {
    const params = useParams();
    const router = useRouter();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const onExpand = (documenId: string) => {
        setExpanded(prevExpanded => ({
            ...prevExpanded,
            [documenId]: !prevExpanded[documenId],
        }));
    };

    const documents = useQuery(api.documents.getSidebar, {
        parentDocument: parentDocumentId,
    });

    const onRedirect = (documenId: string) => {
        router.push(`/documents/${documenId}`);
    };

    if (documents === undefined) {
        return(
            <>
                <Item.Skeleton level={level} />
                {level === 0 &&(
                    <>
                    <Item.Skeleton level={level} />
                    <Item.Skeleton level={level} />
                    </>
                )}
            </>
        );
    };

    return (
        <>
            <p
                style={{
                    paddingLeft: level ? `${level * 12 + 25}px` : undefined,
                }}
                className={cn(
                    'hidden text-sm font-medium text-muted-foreground/80',
                    expanded && 'last:block',
                    level === 0 && 'hidden'
                )}
            >
                No Pages inside
            </p>
            {documents.map((document) => (
                <div key={document._id}>
                    <Item
                        id={document._id}
                        onClick={() => onRedirect(document._id)}
                        label={document.title}
                        icon={FileIcon}
                        documentIcon={document.icon}
                        active={params.documenId === document._id}
                        level={level}
                        onExpand={() => onExpand(document._id)}
                        expanded={expanded[document._id]}
                    />
                    {expanded[document._id] && (
                        <DocumentList
                            parentDocumentId={document._id}
                            level={level + 1}
                            router={router} // Pass the router down to nested components
                        />
                    )}
                </div>
            ))}
        </>
    );
};
