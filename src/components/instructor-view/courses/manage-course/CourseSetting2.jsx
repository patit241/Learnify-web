import { mediaUploadService } from "@/api/cloudinary"
import MediaProgressbar from "@/components/mediaProgressBar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InstructorContext } from "@/context/instructor-context/InstructorContext"

import { useContext } from "react"

function CourseSettings2() {
    const { courseLandingFormData, setCourseLandingFormData, mediaUploadProgress, setMediaUploadProgress, mediaUploadProgressPercentage, setMediaUploadProgressPercentage } = useContext(InstructorContext)

    // console.log(courseLandingFormData)
    function handleImageUploadChange(event) {
        const selectedImage = event.target.files[0];
        if (selectedImage) {
            // Generate local preview URL
            const imageUrl = URL.createObjectURL(selectedImage);

            // Update the form data with the local preview URL
            setCourseLandingFormData({
                ...courseLandingFormData,
                image: selectedImage , // Store local preview
                imagePreview: imageUrl // Keep the file for backend upload
            });

            // Optionally, clear progress or any other state
            setMediaUploadProgress(false);
        }
    }
    // console.log(courseLandingFormData)


    return (
        <Card>
            <CardHeader>
                <CardTitle>Course Images</CardTitle>
            </CardHeader>
            <div className="p-4">
                {
                    mediaUploadProgress ?
                        <MediaProgressbar isMediaUploading={mediaUploadProgress} progress={mediaUploadProgressPercentage} />
                        : null
                }
            </div>

            <CardContent>
                <div className="flex flex-col gap-3">
                    <Label>Upload Course Image</Label>
                    <Input onChange={handleImageUploadChange} type="file" accept="image/*" />
                </div>
                <div>
                    {
                        courseLandingFormData.imagePreview
                        ?<img src={courseLandingFormData.imagePreview} alt="Course Preview" className="w-full h-auto" />
                        :<img src={courseLandingFormData.image} alt="Course Preview" className="w-full h-auto" />
                    }

                </div>
            </CardContent>
        </Card>
    )
}
export default CourseSettings2