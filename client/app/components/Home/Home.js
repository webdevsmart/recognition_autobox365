import React, { Component } from 'react';
import 'whatwg-fetch';
import axios from 'axios';
import { Container, Row, Col, Form} from 'react-bootstrap';
import MyDropzone from '../MyDropzone/MyDropzone'
import Skeleton from 'react-loading-skeleton';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photos: [],
    };

    this.handleAddedFiles = this.handleAddedFiles.bind(this);
  }

  readUploadedPhotoPreview(imageFile) {
    const imageFileReader = new FileReader();
    return new Promise((resolve, reject) => {
        imageFileReader.onerror = () => {
            imageFileReader.abort();
            reject(new DOMException("Problem parsing input file."));
        };
        imageFileReader.onload = () => {
            resolve(imageFileReader.result)
        };
        imageFileReader.readAsDataURL(imageFile);
    });
  }

  async handleAddedFiles(files) {
    let photos = this.state.photos
      for (let i = 0; i < files.length; i++) {
          if (files[i].type.includes('image')) {
              const photoPreview = await this.readUploadedPhotoPreview(files[i])
              let photo_data = {
                  image_src: photoPreview,
                  file_data: files[i],
                  status: 'uploading',
                  is_upload: false,
              }
              photos.push(photo_data)
          }
      }
      this.setState({photos: photos}, () => {
        this.state.photos.map((photo, index) => {
          if (photo.is_upload == false) {
            let formData =  new FormData();
            formData.append('file', photo.file_data);
            setTimeout(function(){ 
              axios.post("/api/recognition", formData)
              .then(response => response.data)
              .then(response => {
                let api_result = JSON.parse(response.api_result);
                if (api_result.is_success) {
                  let photoList = this.state.photos;
                  photoList[index].make = api_result.detections[0].mm[0].make_name;
                  photoList[index].model = api_result.detections[0].mm[0].model_name;
                  photoList[index].generation = api_result.detections[0].mmg[0].generation_name;
                  photoList[index].year = api_result.detections[0].mmg[0].years;
                  photoList[index].generation = api_result.detections[0].mmg[0].generation_name;
                  photoList[index].colour = api_result.detections[0].color[0].name;
                  photoList[index].countries = response.countries.toString();
                  photoList[index].plateNumber = response.plateNumber;
                  photoList[index].provience = response.extra;
                  
                  photoList[index].is_upload = true;
                  console.log(photoList);
                  this.setState({photos: photoList});
                }
              })
              .catch(err => {
                console.log(err);
              });
            }.bind(this), 2000 * index);
          }
        })
      })
  }

  componentDidMount() {
  }

  render() {
    return (
      <>
        <Container>
          <Row>
            <Col sm="6">
              <h2>Car recognition tool</h2>
              <p className="text-muted">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </Col>
            <Col sm="6">
              <MyDropzone onDrop={acceptedFiles => this.handleAddedFiles(acceptedFiles)} />
            </Col>
          </Row>
          <Row className="mb-5">
            <Col>
              <h3 className="text-muted">Recognition Result:</h3>
              <Row>
                {
                  this.state.photos.map((photo, index) => {
                    return (
                      <Col md="12" key={index} className="mb-3">
                        <div className="card flex-row flex-wrap shadow rounded p-3 align-items-center">
                          <div className="border-0 col-md-4">
                              <img src={photo.image_src} alt="" style={{width: '100%'}} className="rounded" />
                          </div>
                          <div className="card-block px-2 col-md-8">
                              {
                                !photo.is_upload ? (
                                  <Skeleton count={8}/>
                                ) : (
                                  <>
                                    <Row>
                                      <Col>
                                        <Form.Group>
                                          <Form.Label className="text-muted">Make</Form.Label>
                                          <Form.Text className="text-one text-primary">
                                            {photo.make}
                                          </Form.Text>
                                        </Form.Group>
                                      </Col>
                                      <Col>
                                        <Form.Group>
                                          <Form.Label className="text-muted">Colour</Form.Label>
                                          <Form.Text className="text-one text-primary">
                                            {photo.colour}
                                          </Form.Text>
                                        </Form.Group>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col>
                                        <Form.Group>
                                          <Form.Label className="text-muted">Model</Form.Label>
                                          <Form.Text className="text-one text-primary">
                                            {photo.model}
                                          </Form.Text>
                                        </Form.Group>
                                      </Col>
                                      <Col>
                                        <Form.Group>
                                          <Form.Label className="text-muted">Plate</Form.Label>
                                          <Form.Text className="text-one text-primary">
                                            {photo.plateNumber}
                                          </Form.Text>
                                        </Form.Group>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col>
                                        <Form.Group>
                                          <Form.Label className="text-muted">Generation</Form.Label>
                                          <Form.Text className="text-one text-primary">
                                            {photo.generation}
                                          </Form.Text>
                                        </Form.Group>
                                      </Col>
                                      <Col>
                                        <Form.Group>
                                          <Form.Label className="text-muted">Country</Form.Label>
                                          <Form.Text className="text-one text-primary">
                                            {photo.countries}
                                          </Form.Text>
                                        </Form.Group>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col>
                                        <Form.Group>
                                          <Form.Label className="text-muted">Year</Form.Label>
                                          <Form.Text className="text-one text-primary">
                                            {photo.year}
                                          </Form.Text>
                                        </Form.Group>
                                      </Col>
                                      <Col>
                                        <Form.Group>
                                          <Form.Label className="text-muted">Provience</Form.Label>
                                          <Form.Text className="text-one text-primary">
                                            {photo.provience}
                                          </Form.Text>
                                        </Form.Group>
                                      </Col>
                                    </Row>
                                  </>
                                )
                              }
                            
                          </div>
                        </div>
                      </Col>
                    )
                  })
                }
              </Row>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Home;

