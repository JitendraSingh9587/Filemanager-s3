# FileManager-s3 Integration

This guide provides instructions on how to integrate FileManager-s3 package into your project along with explanations for each parameter.

## Install The Package

```bash
    npm i -f FileManager-s3
```

## Usage

```bash
    import FileManager from "FileManager-s3";
    import React, { useState } from "react";

    function App() {
        // State to manage the opening and closing of the file manager modal
        const [open, setOpen] = useState(false);
    }

    // Function to handle closing the file manager modal
    function handleCloseFileManager() {
      setOpen(false);
    }

    // Function to handle selected URL
    function handleSelectedUrl(url) {
      console.log("Selected URL:", url);
    }

    return (
      <div className="App">
        {/* Button to open FileManager */}
        <button onClick={() => setOpen(!open)}>Open FileManager</button>

        {/* FileManager Component */}
        <FileManager
          openModal={open} // Boolean value to control the opening and closing of the modal
          handleClose={handleCloseFileManager} // Function to handle closing the modal
          onSelect={handleSelectedUrl} // Function to handle the selected URL
          accessKeyId={awsAccessKeyID} // AWS Access Key ID
          secretAccessKey={awsSecretAccessKey} // AWS Secret Access Key
          awsRegion={awsRegion} // AWS Region where the bucket is located
          BucketName={awsBucketName} // Name of the AWS S3 Bucket
        />
      </div>
    );
  }

  export default App;
```

## Parameters Explanation:

`openModal`: A boolean value determining whether the file manager modal is open or closed.

`handleClose`: A function to handle the closing of the file manager modal.

`onSelect`: A function to handle the selected URL from the file manager.

`accessKeyId`: The Access Key ID for accessing the AWS services.

`secretAccessKey`: The Secret Access Key corresponding to the Access Key ID.

`awsRegion`: The region where your AWS S3 bucket is located(e.g., "us-east-1").

`BucketName`: The name of the AWS S3 bucket where files will be stored and retrieved.

Make sure to replace placeholders like `awsAccessKeyID`, `awsSecretAccessKey`, `awsRegion`, and `awsBucketName` with your actual AWS credentials and bucket information.
