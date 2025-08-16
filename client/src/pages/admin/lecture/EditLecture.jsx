import { Link, useParams } from "react-router-dom";
import LectureTab from "./LectureTab";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const EditLecture = () => {
    const params = useParams();
    const courseId = params.courseId;
    return (
        <div className="space-y-8 md:mt-15">
            <div className="flex items-center gap-4">
                <Button asChild size="icon" variant="outline" className="rounded-full">
                    <Link to={`/admin/course/${courseId}/lecture`}>
                        <ArrowLeft size={20} />
                        <span className="sr-only">Back to lectures</span>
                    </Link>
                </Button>
                <h1 className="font-bold text-2xl text-gray-800 dark:text-white">Update Lecture</h1>
            </div>
            <LectureTab />
        </div>
    );
};

export default EditLecture;