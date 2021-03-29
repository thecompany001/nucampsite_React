import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LocalForm, Control, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

const maxLength = len => val => !(val) || (val.length <= len);
const minLength = len => val => val && (val.length >= len);


function RenderCampsite({ campsite }) {
    return (
        <div className="col-md-5 m-1">
            <Card>
                <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                <CardBody>
                    <CardTitle>{campsite.name}</CardTitle>
                    <CardText>{campsite.description}</CardText>
                </CardBody>
            </Card>
        </div>
    );
}

function RenderComments({comments, postComment, campsiteId}) {
    if (comments) {
        return (
            <div className="col-md-5 m-1">
                <h4>Comments</h4>
                {comments.map(comment => {
                    return (
                        <div>
                            <p>{comment.text} <br />-- {comment.author}
                                {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}</p>
                        </div>
                    )
                })}
                <CommentForm campsiteId={campsiteId} postComment={postComment} />
            </div>
        );
    }
    return <div />
}


class CommentForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            rating: '',
            author: '',
            text: '',
            isModalOpen: false
        }
    this.toggleModal = this.toggleModal.bind(this);
    };

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }
    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
    }

    render() {
        return (
            <div>
            <Button outline onClick={this.toggleModal}>
                <i className="fa fa-pencil fa-lg" /> Submit Comment
            </Button>
            <Modal isOpen={this.state.isModalOpen}>
                <ModalHeader toggle={this.toggleModal}>
                    Submit comment
                </ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit={values => this.handleSubmit(values)}>
                        <div className="form-group">
                            <Label htmlFor="rating">Rating</Label>
                            <Control.select model=".rating" id="rating" name="rating"
                                placeholder="Rating"
                                className="form-control">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option></Control.select>
                            <Errors
                                className='text-danger'
                                model='.rating'
                                show='touched'
                                component='div'
                                messages={{
                                    required: 'Required',
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <Label htmlFor="author">Author</Label>

                            <Control.text model=".author" id="author" name="author"
                                placeholder="Your name"
                                className="form-control"
                                validators={{
                                    minLength: minLength(2),
                                    maxLength: maxLength(15),
                                }}/>
                            <Errors 
                                className="text-danger"
                                model=".author"
                                show="touched"
                                components="div"
                                messages={{
                                    minLength: 'Must be at least 2 characters',
                                    maxLength: 'Must be 15 characters or less'
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <Label htmlFor="text">Text</Label>

                            <Control.textarea model=".text" rows="6" id="text" name="text"
                                placeholder="Please add comments here"
                                className="form-control"
                            />
                        </div>
                        <Button type="submit" color="primary">Submit
                        </Button>
                    </LocalForm>
                </ModalBody>
            </Modal>
            </div>
        );
    }
}

function CampsiteInfo(props) {
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        )
    }
    if (props.campsite) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <h2>{props.campsite.name}</h2>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments 
                        comments={props.comments}
                        postComment={props.postComment}
                        campsiteId={props.campsite.id}
                    />
                </div>
            </div>
        )
    }
    return <div />
}


export default CampsiteInfo;