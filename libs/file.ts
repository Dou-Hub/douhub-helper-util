//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.
export const getFileType = (fileName: string): string => {

    const ext = fileName.split('.')[fileName.split('.').length - 1].toLowerCase();
    switch (ext.toLowerCase()) {
        case 'doc':
        case 'docx':
            {
                return 'Document';
            }
        case 'gif':
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'jpeg':
            {
                return 'Photo';
            }
        case 'mp4':
            {
                return 'Video';
            }
        case 'mp3':
            {
                return 'Audio';
            }
    }

    return 'Document';
}

export const getContentType = (fileName: string): string => {

    const ext = fileName.split('.')[fileName.split('.').length - 1].toLowerCase();
    switch (ext.toLowerCase()) {
        case 'doc':
        case 'docx':
            {
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/excel,application/vnd.ms-excel,application/pdf,text/plain,text/html,text/csv,application/zip,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation';
            }
        case 'xls':
        case 'xlsx':
            {
                return 'application/excel,application/vnd.ms-excel,text/csv';
            }
        case 'gif':
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'jpeg':
            {
                return `image/${ext}`;
            }
        case 'mp4':
            {
                return `video/${ext}`;
            }
        case 'mp3':
            {
                return 'audio/mpeg';
            }
    }

    return 'text/plain';
}

export const getAcceptMIMEs = (type: string): string => {
    switch (type.toLowerCase()) {
        case 'document':
            {
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/excel,application/vnd.ms-excel,application/pdf,text/plain,text/html,text/csv,application/zip,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation';
            }
        case 'upload':
            {
                return 'text/csv';
            }
        case 'photo':
            {
                return 'image/gif,image/jpg,image/jpeg,image/png';
            }
        case 'video':
            {
                return 'video/mp4';
            }
        case 'video-photo':
        case 'photo-video':
            {
                return 'image/gif,image/jpg,image/jpeg,image/png,video/mp4';
            }
        case 'audio':
            {
                return 'audio/mpeg';
            }
    }

    return 'text/plain';
}

export const getAcceptFileExtensions = (type: string): string => {
    switch (type.toLowerCase()) {
        case 'document':
            {
                return '*.doc, *.docx, *.xls, *.xlsx, *.pdf, *.txt, *.csv, *.ppt, *.pptx, *.JSON, *.html, *.htm, *.xml, *.zip';
            }
        case 'photo':
            {
                return '*.gif, *.jpeg, *.jpg, *.png';
            }
        case 'video':
            {
                return '*.mp4';
            }
        case 'video-photo':
        case 'photo-video':
            {
                return '*.gif, *.jpeg, *.jpg, *.png, *.mp4';
            }
        case 'audio':
            {
                return '*.mp3';
            }
    }

    return '*.txt';
}

