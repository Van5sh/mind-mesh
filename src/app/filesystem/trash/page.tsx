"use client";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Icon, Trash2Icon } from "lucide-react";

const Trash=()=> {
    return (
        <div className="flex justify-center items-center">
            <Empty title="Trash is Empty">
                <EmptyMedia>
                    <Trash2Icon size={48} className="text-gray-400" />
                </EmptyMedia>
                <EmptyTitle>NO FILES IN THE TRASH</EmptyTitle>
                <EmptyDescription>
                    You haven&apos;t created any projects yet. Get started by creating
                    your first project.
                </EmptyDescription>
            </Empty>
        </div>
    )
}
export default Trash;