### Install The Package

    npm i -f

### Use this below code for intigration

    import FileManager from "FileManager-s3";

    function App() {
    const [open, setOpen] = useState(false);
    function handleCloseFilemanager() {
      setOpen(false);
    }
    function handleSlectedUrl(Url) {
      console.log("🚀 ~ handleSlectedUrl ~ Url:", Url);
    }
    return (
      <div className="App">
        <button onClick={() => setOpen(!open)}>Open FileManager</button>
        <FileManager
          openModal={open}
          handleClose={handleCloseFilemanager}
          onselect={handleSlectedUrl}
          accessKeyId={awsAccessKeyID}
          secretAccessKey={AwssecretAccessKey}
          awsregion={awsRegion}
          BucketName={AwsBucketname}
        />
      </div>
    );
    }

    export default App;
