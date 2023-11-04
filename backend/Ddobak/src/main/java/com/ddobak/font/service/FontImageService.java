package com.ddobak.font.service;

import com.ddobak.global.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.aop.scope.ScopedProxyUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.http.converter.ByteArrayHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
@ComponentScan
public class FontImageService {

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private S3Service s3Service;



    public File convertToPng(MultipartFile file) throws IOException{
        String fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        File tempInputFile = File.createTempFile("source","."+fileExtension);

        file.transferTo(tempInputFile);

        File tempOutputFile = File.createTempFile("converted", ".png");

        if ("png".equalsIgnoreCase(fileExtension)){
            return tempInputFile;
        } else if ("JPG".equalsIgnoreCase(fileExtension)) {
            tempOutputFile = convertJpgToPng(tempInputFile);
        }else if("pdf".equalsIgnoreCase(fileExtension)){
            convertPdfToPng(tempInputFile,tempOutputFile);
        }

        return tempOutputFile;

    }

    private File convertJpgToPng(File tempInputFile) throws IOException {
        BufferedImage bufferedImage = ImageIO.read(tempInputFile);

        File outputFile = new File(tempInputFile.getParentFile(),"converted.png");
        ImageIO.write(bufferedImage,"png",outputFile);

        return outputFile;
    }

    public String getS3SortUrl(File imageFile) {// 8889  8786 http://163.239.223.171:8786/api/v1/image_align
        String fastApiUrl = "http://localhost:8000/sortUpload";
        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        FileSystemResource resource = new FileSystemResource(imageFile);

        MultiValueMap<String,Object> body = new LinkedMultiValueMap<>();

        body.add("file",resource);

        HttpEntity<MultiValueMap<String,Object>> requestEntity = new HttpEntity<>(body,headers);

        ResponseEntity<byte[]> response = restTemplate.exchange(fastApiUrl, HttpMethod.POST, requestEntity,byte[].class);

        String contentType = response.getHeaders().getContentType().toString();
        String s3Url = new String();

        s3Url = s3Service.uploadSortFile(response.getBody(),"image/png");

        return s3Url;
    }

    public ResponseEntity<byte[]> downloadZip(List<File> imageFiles){

        ByteArrayHttpMessageConverter byteArrayHttpMessageConverter = new ByteArrayHttpMessageConverter();
        List<MediaType> supportedMediaTypes = new ArrayList<>(byteArrayHttpMessageConverter.getSupportedMediaTypes());
        supportedMediaTypes.add(MediaType.parseMediaType("application/x-zip-compressed"));
        byteArrayHttpMessageConverter.setSupportedMediaTypes(supportedMediaTypes);

        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(byteArrayHttpMessageConverter);
        String fastApiUrl = "http://localhost:8000/downloadZip";
        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        int fileIndex = 1;
        for (File imageFile : imageFiles) {
            FileSystemResource resource = new FileSystemResource(imageFile);
            body.add("file" + fileIndex, resource);
            fileIndex++;
        }

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        System.out.println("???");

        ResponseEntity<byte[]> zip = restTemplate.exchange(
                fastApiUrl,
                HttpMethod.POST,
                requestEntity,
                byte[].class
        );
        System.out.println("???");

        return new ResponseEntity<>(zip.getBody(), headers, HttpStatus.OK);
    }

    public String getS3FontUrl(List<File> imageFiles) {
        String fastApiUrl = "http://localhost:8000/makeUpload";
        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        int fileIndex = 1;
        for (File imageFile : imageFiles) {
            FileSystemResource resource = new FileSystemResource(imageFile);
            body.add("file" + fileIndex, resource);
            fileIndex++;
        }

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> s3FontUrl = restTemplate.exchange(
                fastApiUrl,
                HttpMethod.POST,
                requestEntity,
                String.class
        );
        String responseBody = s3FontUrl.getBody();
        if (responseBody != null) {
            responseBody = responseBody.replaceAll("^\"|\"$", "");
        }
        System.out.println("############");
        System.out.println(responseBody);
        System.out.println("############");
        System.out.println(s3FontUrl.getBody());
        System.out.println("############");

        return responseBody;
    }


    private void convertPdfToPng(File inputFile, File outputFile) throws IOException {
        String fileExtension = getExtention(inputFile.getName());
        BufferedImage image;


        try (PDDocument document = PDDocument.load(inputFile)) {

            PDFRenderer pdfRenderer = new PDFRenderer(document);
            image = pdfRenderer.renderImageWithDPI(0,200);
        }

        ImageIO.write(image, "PNG", outputFile);

    }
    private String getExtention(String filename){
        String extension = StringUtils.getFilenameExtension(filename);
        return extension;
    }
    public List<File> urlToFile(String url) throws IOException {
        String[] urls = url.split("\\$");

        InputStream in1 = new URL(urls[0]).openStream();
        InputStream in2 = new URL(urls[1]).openStream();
        File tempFile1 = File.createTempFile("kor_file",".png");
        File tempFile2 = File.createTempFile("eng_file",".png");

        copyInputStreamToFile(in1, tempFile1);
        copyInputStreamToFile(in2, tempFile2);

        List<File> tempFile = new ArrayList<>();

        tempFile.add(tempFile1);
        tempFile.add(tempFile2);

        return tempFile;
    }
    private void copyInputStreamToFile(InputStream inputStream, File file) throws IOException {
        // try-with-resources를 사용하여 자동으로 리소스를 정리
        try (FileOutputStream outputStream = new FileOutputStream(file)) {
            int read;
            byte[] bytes = new byte[1024];
            while ((read = inputStream.read(bytes)) != -1) {
                outputStream.write(bytes, 0, read);
            }
        }
    }
}
