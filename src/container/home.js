import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, Input, Label, FormGroup } from 'reactstrap';
import { SendingUserData, errorReducerFunc, errorReducerCloseFunc, SendingAllUserData2, LogoutAction, SendMessageAction, RenderConvo, ClearState } from '../store/actions/action'
import { firebaseSignOut, fire, database } from '../fire'
import Navbarcom from '../components/nav'
import Modalcom from '../components/modal'


import Modal from 'react-modal';


import { browserHistory } from 'react-router'
import { Container, Row, Col } from 'reactstrap';
import { ListGroup, ListGroupItem } from 'reactstrap';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor:'#007bff'
    }
};


let mapStateToProps = (state) => {
    return (
        {
            reduxstate: state.AuthReducer.name,
            myUid: state.AuthReducer.useruid,
            AllUserArray: state.AuthReducer.AllUserData,
            errormessage: state.AuthReducer.errormessage,
            errorflag: state.AuthReducer.errorflag,
            conversation: state.SendMessage.allarray,
        }
    )
}


let mapStatetodispatch = (dispatch) => {
    return {
        sendingUserDataToReduxState: (value) => {
            dispatch(SendingUserData(value))
        },
        errorFunc: (error) => {
            dispatch(errorReducerFunc(error))
        },
        errorCloseFunc: (errorboolean) => {
            dispatch(errorReducerCloseFunc(errorboolean))
        },
        SendingAllUserData: () => {

            dispatch(SendingAllUserData2())
        },
        Logoutfunc: () => {

            dispatch(LogoutAction())
        },
        RenderConvo1: (MessageObj) => {

            dispatch(RenderConvo(MessageObj))
        }, ClearState1: () => {

            dispatch(ClearState())
        }
    }
}
class Home extends Component {
    constructor() {
        super()
        this.state = {
            userdata: '',
            modalIsOpen: false,
            WantToChatUserName: '',
            WantToChatUserUid: '',
            SendMessageInputValue: '',
            editswitch: 'Send',
            array:''

        }

    }
    SendMessage = (value) => {

        if (this.state.editswitch === 'Edit') {
            let value=this.state.array
            let useruid = JSON.parse(localStorage.getItem('UserData')).uid
            let nodekey = value.key;
            let receiverUid = value.receiverUid;
            let Mdate = ""
            let CurrentDate = new Date().getTime();
            let OppNodekey;
            database.child('user').child(useruid).child('conversations').child(receiverUid).child(nodekey).once("child_added", function (snapshot) {
                var obj1 = snapshot.val()

                Mdate = obj1
            })

            database.child('user').child(receiverUid).child('conversations').child(useruid).on("child_added", function (snapshot) {
                let obj = snapshot.val();
                obj.key = snapshot.key
                if (obj.AMessagedate === Mdate) {
                    OppNodekey = obj.key;
                }
            })


            let Difference = CurrentDate - Mdate;
            setTimeout(() => {

                if (Mdate != '') {
                    if (Difference < 60000) {
                        let editvalue = this.state.SendMessageInputValue




                        let DBMessageObject = {
                            senderUid: value.senderUid,
                            receiverUid: value.receiverUid,
                            receiverName: value.receiverName,
                            senderName: value.senderName,
                            Message: editvalue,
                            AMessagedate: new Date().getTime(),
                            Type: value.Type
                        }

                        let MessageObj = {
                            senderUid: JSON.parse(localStorage.getItem('UserData')).uid,
                            receiverUid: receiverUid,
                        }

                        if (editvalue != undefined && editvalue != "") {
                            database.child('user').child(useruid).child('conversations').child(receiverUid).child(nodekey).update(DBMessageObject)
                            database.child('user').child(receiverUid).child('conversations').child(useruid).child(OppNodekey).update(DBMessageObject)
                            this.setState({
                                editswitch:'Send'
                            })
                        }

                        this.props.RenderConvo1(MessageObj)
                    } else {
                        let errorObject = {
                            errorflag: true,
                            error: "Time has been exceeded, You could not edit your message now"
                        }
                        this.setState({
                            editswitch:'Send'
                        })
                        this.props.errorFunc(errorObject)

                    }
                }
                else {
                    let errorObject = {
                        errorflag: true,
                        error: "You could not edit your friend's message"
                    }
                    this.setState({
                        editswitch:'Send'
                    })
                    this.props.errorFunc(errorObject)

                }
            }, 2000)
        }

        else {
            let Message = this.state.SendMessageInputValue;
            let senderUid = JSON.parse(localStorage.getItem('UserData')).uid;
            let senderName = JSON.parse(localStorage.getItem('UserData')).name
            let receiverUid = this.state.WantToChatUserUid;
            let receiverName = this.state.WantToChatUserName;

            let MessageObj = {
                senderUid: senderUid,
                senderName: senderName,
                receiverUid: receiverUid,
                receiverName: receiverName,
                Message: Message,
                MessageData: new Date
            }

            if (Message != "") {
                SendMessageAction(MessageObj)
                setTimeout(() => {
                    this.props.RenderConvo1(MessageObj)
                }, 2000)
            } else {
                let errorObject = {
                    errorflag: true,
                    error: "You could not send empty messages"
                }
                this.props.errorFunc(errorObject)

            }
        }
    }
    openModal = (idx) => {
        // alert(idx)
        // this.openModal(idx)


        let MessageObj = {
            senderUid: JSON.parse(localStorage.getItem('UserData')).uid,
            receiverUid: idx.useruid,
        }


        database.child('user').child(MessageObj.receiverUid).child('conversations').child(MessageObj.senderUid).on("child_added", function (snapshot) {
            let obj = snapshot.val();
            obj.key = snapshot.key
            // if (obj.AMessagedate === Mdate) {
            //     OppNodekey = obj.key;
            // }

            let DBMessageObject = {
                senderUid: obj.senderUid,
                receiverUid: obj.receiverUid,
                receiverName: obj.receiverName,
                senderName: obj.senderName,
                Message: obj.Message,
                AMessagedate: new Date().getTime(),
                Type: 'seen'
            }
            if (obj.receiverName !== idx.name) {
                database.child('user').child(MessageObj.receiverUid).child('conversations').child(MessageObj.senderUid).child(obj.key).update(DBMessageObject)

            }


            // alert(obj1.receiverName)

        })


        // console.log(idx)




        // database.child('user').child(MessageObj.receiverUid).child('conversations').child(MessageObj.senderUid).on("child_added", function (snapshot) {
        //     let obj = snapshot.val()
        //     obj.key = snapshot.key
        //     // alert(obj.Message)



        //         if(obj.Type==="unseen"){
        //             database.child('user').child(MessageObj.receiverUid).child('conversations').child(MessageObj.senderUid).child(obj.key).update({Type:'Seen'})
        //         }
        //         })




        this.setState({
            modalIsOpen: true,
            WantToChatUserName: idx.name,
            WantToChatUserUid: idx.useruid
        });



        this.props.RenderConvo1(MessageObj)
    }






    closeModal = () => {
        this.props.ClearState1()
        this.setState({ modalIsOpen: false });
    }
    componentDidMount() {

        this.props.SendingAllUserData()
    }
    componentWillMount() {

        fire.auth().onAuthStateChanged((user) => {

            if (user) {

                // User is signed in.
                let useruid = JSON.parse(localStorage.getItem("UserData")).uid

                let AllUserObject = []
                let UserData = {
                    name: "",
                    uid: useruid,
                    email: '',
                }


                database.child('user/' + useruid).once("child_added", function (snapshot) {
                    // UserData.name=snapshot.username;
                    // UserData.email=snapshot.email;
                    var obj = snapshot.val()

                    UserData.name = obj.username
                    UserData.email = obj.email
                    localStorage.setItem('UserData', JSON.stringify(UserData))
                }).then((snapshot)=>{
                        this.props.sendingUserDataToReduxState(UserData)
    

                })



            } else {
                localStorage.removeItem('userData')
                window.location.href = '/'
                browserHistory.replace('/')
            }
        });
    }



    Logoutfunc = () => {
        firebaseSignOut.signOut()
        this.props.Logoutfunc()
        window.location.href = '/'
    }

    closeModalfunc = () => {
        this.props.errorCloseFunc()
    }







    EditFunc = (value) => {


        this.setState({
            editswitch: 'Edit',
            array:value
        })



    }












    DeleteFunc = (value) => {


        let useruid = JSON.parse(localStorage.getItem('UserData')).uid
        let nodekey = value.key;
        let receiverUid = value.receiverUid;
        let Mdate = ""
        let CurrentDate = new Date().getTime();
        let OppNodekey;
        database.child('user').child(useruid).child('conversations').child(receiverUid).child(nodekey).once("child_added", function (snapshot) {
            var obj1 = snapshot.val()

            Mdate = obj1
        })

        database.child('user').child(receiverUid).child('conversations').child(useruid).on("child_added", function (snapshot) {
            let obj = snapshot.val();
            obj.key = snapshot.key
            if (obj.AMessagedate === Mdate) {
                OppNodekey = obj.key;
            }
        })


        let Difference = CurrentDate - Mdate;
        setTimeout(() => {

            if (Mdate != '') {
                if (Difference < 60000) {
                    let MessageObj = {
                        senderUid: JSON.parse(localStorage.getItem('UserData')).uid,
                        receiverUid: receiverUid,
                    }
                    database.child('user').child(useruid).child('conversations').child(receiverUid).child(nodekey).remove()
                    database.child('user').child(receiverUid).child('conversations').child(useruid).child(OppNodekey).remove()

                    this.props.RenderConvo1(MessageObj)
                } else {
                    let errorObject = {
                        errorflag: true,
                        error: "Time has been exceeded, You could not delete your message now"
                    }
                    this.props.errorFunc(errorObject)

                }
            }
            else {
                let errorObject = {
                    errorflag: true,
                    error: "You could not delete your friend's message"
                }
                this.props.errorFunc(errorObject)

            }
        }, 2000)
    }


    render() {

        return (

            <Container fluid={true}>
                <Navbarcom NavbarText={this.props.reduxstate} Logoutfunc={() => this.Logoutfunc()} />

                <div style={{ border: "1px solid black", width: "300px", overflow: "scroll", height: '90vh', padding: '1%', position: 'fixed' ,backgroundColor:'black'}}>
                    <h2 style={{color:'#007bff',marginLeft:'7%'}}>All Users</h2>
                    <br />
                    <ListGroup>

                        {

                            this.props.AllUserArray.map((value, index) => {
                                return (

                                    <Button color="link" style={{ textDecoration: 'none' }} onClick={() => this.openModal(value)}>
                                        <ListGroupItem>
                                            {value.name}

                                        </ListGroupItem>
                                    </Button>

                                )

                            })
                        }


                    </ListGroup>

                </div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >

                    <button onClick={this.closeModal} style={{ float: "right" }}>X</button>
                    <h2 ref={subtitle => this.subtitle = subtitle}>{this.state.WantToChatUserName}</h2>

                    <div style={{ border: "1px solid black", width: "300px", overflow: "scroll", height: '200px', padding: '1%', scrollX: 'none' ,backgroundColor:'white'}}>
                        {


                            this.props.conversation.map((value, index) => {
                                let senderName = value.senderName
                                let date = value.AMessagedate
                                let Hour = new Date(date).getHours();
                                let Minute = new Date(date).getMinutes();
                                let Second = new Date(date).getSeconds();
                                let Date1 = new Date(date).getDate()
                                let Month = new Date(date).getMonth()
                                let Year = new Date(date).getFullYear()
                                let status = (senderName === JSON.parse(localStorage.getItem('UserData')).name) ? (value.Type) : ('')
                                date = new Date(date).getDate()
                                return (
                                    <div style={{ border: '1px dotted gray', padding: '4% 1% 5% 1%', width: '90%', margin: '2% auto', overflowWrap: " break-word"}} className="panel-Body scroll">
                                        <h6>{value.senderName}</h6>
                                        <li style={{ listStyle: 'none' }}><span style={{ fontSize: '12px' }}>{value.Message}</span></li>
                                        <small>{`${status} ${Hour}:${Minute}:${Second}`}</small>
                                        <br />
                                        <small>{`${Date1}/${Month}/${Year}`}</small>
                                        <button onClick={() => this.EditFunc(value)} style={{ float: 'right' }}><small>Edit</small></button>

                                        <button onClick={() => this.DeleteFunc(value)} style={{ float: 'right' }}><small>Delete</small></button>
                                    </div>
                                )

                            })

                        }


                    </div>
                    <FormGroup>
                        <Input type="textarea" name="text" id="exampleText" style={{ marginTop: '1%' }} onChange={(value1) => this.setState({ SendMessageInputValue: value1.target.value })} />
                        <Button outline color="danger" style={{ marginTop: '1%' }} onClick={() => this.SendMessage()}>{this.state.editswitch}</Button>
                    </FormGroup>
                </Modal>


                <Modalcom ModalBoolean={this.props.errorflag} closeModalRequest={() => this.closeModalfunc()} ModalText={this.props.errormessage} />

            </Container>
        );
    }
}
export default connect(mapStateToProps, mapStatetodispatch)(Home)