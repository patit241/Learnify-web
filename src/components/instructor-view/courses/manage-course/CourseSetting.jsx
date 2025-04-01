import { mediaUploadService } from "@/api/cloudinary"
import MediaProgressbar from "@/components/mediaProgressBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InstructorContext } from "@/context/instructor-context/InstructorContext"

import { useContext } from "react"

function CourseSettings(){
    const {courseLandingFormData,setCourseLandingFormData,mediaUploadProgress, setMediaUploadProgress, mediaUploadProgressPercentage, setMediaUploadProgressPercentage} = useContext(InstructorContext)

    async function handleImageUploadChange(event) {
        const selectedImage = event.target.files[0];
        if(selectedImage){
            const imageFormData = new FormData()
            imageFormData.append('file',selectedImage)
            try{
                setMediaUploadProgress(true)
                const response = await mediaUploadService(imageFormData,setMediaUploadProgressPercentage)
                console.log(response,"response")
                if(response.success){
                    setCourseLandingFormData({
                        ...courseLandingFormData,
                        image:response.data.url
                    })
                    setMediaUploadProgress(false)
                }
            }catch(err){
                console.log(err)
            }
        }
        
    }

    // console.log(courseLandingFormData)

    return <Card>
        <CardHeader>
            <CardTitle>
                Course Images
            </CardTitle>
        </CardHeader>
        <div className="p-4">
            {
                mediaUploadProgress?
                <MediaProgressbar isMediaUploading={mediaUploadProgress} progress={mediaUploadProgressPercentage} />
                :null
            }
        </div>

        <CardContent>
            {
                courseLandingFormData?.image?
                <img src = {courseLandingFormData.image} />
                :
            <div className="flex flex-col gap-3" >
                <Label>Upload Course Image</Label>
                <Input onChange={handleImageUploadChange} type="file" accept="image/*" />
            </div>
            }

        </CardContent>
    </Card>
}
export default CourseSettings