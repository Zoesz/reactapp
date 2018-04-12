import React, {Component} from 'react';
import './App.css';
import {auth, database, provider} from './firebase';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            items: [],
            todo: '',
            place: '',
            comment: '',
            isEdit: 0,
            isSolved: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {

        const itemsRef = database.ref('items');
        console.log(itemsRef);
        itemsRef.on('value', (snapshot) => {
            let items = snapshot.val();

            let newState = [];
            for (let item in items) {
                newState.push({
                    id: item,
                    user: items[item].user,
                    todo: items[item].todo,
                    place: items[item].place,
                    comment: items[item].comment,
                    isSolved: items[item].isSolved
                });
            }

            this.setState({
                items: newState
            })
        });

        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user});
            }
        });
    }

    toggle(e) {
        this.setState({
            isSolved: !this.state.isSolved
        });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.state.isEdit) {
            //in case of updating
            database.ref('items/' + this.state.isEdit).set({
                user: this.state.user.email,
                todo: this.state.todo,
                place: this.state.place,
                comment: this.state.comment,
                isSolved: this.state.isSolved
            });

        } else {
            //in case of new todo
            const itemsRef = database.ref('items');

            const item = {
                user: this.state.user.email,
                todo: this.state.todo,
                place: this.state.place,
                comment: this.state.comment,
                isSolved: this.state.isSolved
            };
            itemsRef.push(item);

        }
        this.setState({
            todo: '',
            place: '',
            comment: '',
            isSolved: 'false'
        });

    }

    update(todo, place, comment, isSolved, itemId) {
        this.setState({
            todo: todo,
            place: place,
            comment: comment,
            isSolved: isSolved,
            isEdit: itemId
        });
    }

    removeItem = (itemId) => {
        const itemRef = database.ref(`/items/${itemId}`);
        console.log(itemId);
        itemRef.remove();
    };

    logout() {
        auth.signOut()
            .then(() => {
                this.setState({
                    user: null
                });
            });
    }

    login() {
        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                //To make the table visible ...
                window.location.reload();
                this.setState({
                    user
                });
            });
    }

    render() {
        //checkbox settings
        const checkedOrNot = [];
        checkedOrNot.push(
            <p>{this.state.isSolved ? 'Unchecked' : 'Checked'}</p>
        );
        const checkbox = (<input type="checkbox" onClick={this.toggle.bind(this)} title="Check if you are ready with the task!"/>)

        return (
            <div>
                {this.state.user ?
                    <div>
                        <header>
                            <div className={"container-fluid"}>
                                <div className={"row"}>
                                    <div className={"col-8"}>
                                        <div className={"logo"}>
                                            Do it!
                                        </div>
                                    </div>
                                    <div className={"col-3"}>
                                        <a className={"logout"} href="" onClick={this.logout}>
                                            Logout({this.state.user.displayName})
                                        </a>
                                    </div>
                                    <div className={"col-1"}>
                                        <img className={"img-gmail"} src={this.state.user.photoURL}/>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <div className={"chooser-body"}>
                            <div className={"loading-dots"}>
                                <h1>Time is passing by so fast</h1>
                                <h1 className={"dot one"}>.</h1>
                                <h1 className={"dot two"}>.</h1>
                                <h1 className={"dot three"}>.</h1>
                                <h1 className={"dot excl-mark"}>!</h1>
                                <h3 id={"edit"}>It's time to choose something to do!</h3>
                                <p>(Tip of the day: hover your mouse to get more information!)</p>
                            </div>
                            <section>
                                <form onSubmit={this.handleSubmit}>
                                    <input type="text" name="todo" placeholder="What is your plan?"
                                           onChange={this.handleChange} value={this.state.todo} required/>
                                    <input type="text" name="comment" placeholder="Add some comment!"
                                           onChange={this.handleChange} value={this.state.comment}/>
                                    <select value={this.state.place} onChange={this.handleChange} name="place" title="Select indoor or outdoor activity!">
                                        <option hidden="true"> -- select an option --</option>
                                        <option value="Indoor">Indoor</option>
                                        <option value="Outdoor">Outdoor</option>
                                    </select>
                                    {checkbox}
                                    <button className={'btn btn-primary'}>Add Item</button>
                                </form>
                            </section>
                            <section>
                                <div>
                                    <div className={"container"}>
                                        <div className={"row title"}>

                                            <div className={"col-4"}>ToDo</div>
                                            <div className={"col-3"}>Comment</div>
                                            <div className={"col-2"}>Place</div>
                                            <div className={"col-3"}>Status
                                                <i className={"fa fa-info"} title="You can edit only your ToDos. Try and add a new ToDo!"> </i>
                                            </div>
                                        </div>
                                    </div>
                                    {this.state.items.map((item) => {
                                        return (
                                            <div className={"container"}>
                                                <div className={"row"} key={item.id}>

                                                    <div className={"col-4"}>{item.todo}</div>
                                                    <div className={"col-3"}>{item.comment}</div>
                                                    <div className={"col-2"}>{item.place}</div>


                                                    {item.user === this.state.user.displayName || item.user === this.state.user.email ?
                                                        <div className={"col-3"}>
                                                            {item.isSolved ?
                                                                (<div className={"fa fa-check"}
                                                                      title="Ready"> </div>) : (<div
                                                                    className={"fa fa-exclamation-triangle"}
                                                                    title="ToDo"> </div>)}
                                                            <a title="Edit" href={"#edit"}
                                                               onClick={() => this.update(item.todo, item.place, item.comment, item.isSolved, item.id)}><i
                                                                className={"fa fa-pencil"}> </i>
                                                            </a>
                                                            <a title="Delete" href={"#"}
                                                               onClick={() => this.removeItem(item.id)}><i
                                                                className={"fa fa-times-circle"}> </i>
                                                            </a>
                                                            Yours
                                                        </div>
                                                        :
                                                        <div className={"col-3"}>
                                                            {item.isSolved ?
                                                                (<div className={"fa fa-check"}
                                                                      title="Ready"> </div>) : (<div
                                                                    className={"fa fa-exclamation-triangle"}
                                                                    title="ToDo"> </div>)}
                                                            Other users
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </section>
                        </div>
                    </div>
                    :
                    <div>
                        <header>
                        <div className={"container-fluid"}>
                                <div className={"row"}>
                                    <div className={"col-8"}>
                                        <div className={"logo"}>
                                            Do it!
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div className={"login"}>
                            <button onClick={this.login}>Log in</button>
                            <div className={"login-message"}>Please login with your gmail account or you can use my dummy account:
                                <p>probeapp2018@gmail.com password: react2018</p>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default App;
