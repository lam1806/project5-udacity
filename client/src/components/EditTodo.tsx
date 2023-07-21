import * as React from 'react';
import { Button } from '@material-ui/core'; // Step 1: Import Button component from @material-ui/core
import Auth from '../auth/Auth';
import { getUploadUrl, uploadFile } from '../api/todos-api';

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditTodoProps {
  match: {
    params: {
      todoId: string;
    };
  };
  auth: Auth;
}

interface EditTodoState {
  file: any;
  uploadState: UploadState;
}

export class EditTodo extends React.PureComponent<EditTodoProps, EditTodoState> {
  state: EditTodoState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
  };

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    this.setState({
      file: files[0],
    });
  };

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      if (!this.state.file) {
        alert('File should be selected');
        return;
      }

      this.setUploadState(UploadState.FetchingPresignedUrl);
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.todoId);

      this.setUploadState(UploadState.UploadingFile);
      await uploadFile(uploadUrl, this.state.file);

      alert('File was uploaded!');
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message);
    } finally {
      this.setUploadState(UploadState.NoUpload);
    }
  };

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState,
    });
  }

  render() {
    return (
      <div>
        <h1>Upload new image</h1>

        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="file">File</label>
            <input
              type="file"
              id="file" // Added 'id' attribute to connect with the label
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </div>

          {this.renderButton()}
        </form>
      </div>
    );
  }

  renderButton() {
    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          variant="contained" // Step 2: Add 'variant' prop to style the button
          color="primary" // Step 3: Add 'color' prop to set the button color
          disabled={this.state.uploadState !== UploadState.NoUpload} // Step 4: Disable the button when uploading
          type="submit"
        >
          Upload
        </Button>
      </div>
    );
  }
}
