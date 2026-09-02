import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { diskStorage } from "multer";

@Controller("api/uploads")
@ApiTags("Uploads")
export class UploadsController{
    // Post ~/api/uploads
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    public uploadFile(@UploadedFile()file: Express.Multer.File ){
        if(!file) throw new BadRequestException("no file provided")

        console.log("file uploaded", {file})
        return {message: "file uploaded successfully"}
    }

    // Post ~/api/uploads/multiple-files
    @Post('multiple-files')
    @UseInterceptors(FilesInterceptor('files'))
    public uploadMultipleFiles(@UploadedFiles()files: Array<Express.Multer.File> ){
        if(!files || files.length === 0) throw new BadRequestException("no files provided")

        console.log("files uploaded", {files})
        return {message: "files uploaded successfully"}
    }

    // Get ~/api/uploads/:image
    @Get(':image')
    public getImage(@Param('image')image : string, @Res() response: Response){
        return response.sendFile(image, {root :'images'})
    }
}