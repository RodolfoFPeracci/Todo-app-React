import React, {Component} from 'react'
import axios from 'axios'

import PageHeader from '../template/pageHeader'
import TodoForm from './todoForm'
import TodoList from './todoList'


const URL = 'http://localhost:3003/api/todos'

export default class Todo extends Component{
    //evento para adicionar
    constructor(props){
        super(props)
        this.state = { description: '', list: [] } //Estado inicial do objeto


        this.handleChange = this.handleChange.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleMarkAsDone = this.handleMarkAsDone.bind(this)
        this.handleMarkAsPending = this.handleMarkAsPending.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleClear=this.handleClear.bind(this)



        this.refresh()
    }

    handleRemove(todo){
        axios.delete(`${URL}/${todo._id}`)
            .then(resp => this.refresh(this.state.description))
    }

    refresh(description =''){ //Refresh e Search
        const search = description ? `&description__regex=/${description}/` :''
        axios.get(`${URL}?sort =-createdAt${search}`) //PEGA A DATA DE FORMA DESCRESCENTE
            .then(resp => this.setState({...this.state, description, list: resp.data}))
    }

    handleChange(e){ //ALTERA OS ESTADO ATUAL
        this.setState({...this.state, description: e.target.value})

    }


    handleAdd() { // Integração com o BackEnd
        const description = this.state.description
        axios.post(URL,{description})
            .then(resp => this.refresh()) //SEMPRE QUE ADD ELE IRÁ ATUALIZAR A LISTA
    }

    handleMarkAsDone(todo){
        axios.put(`${URL}/${todo._id}`,{...todo, done: true})
            .then(resp => this.refresh(this.state.description))
    }

    handleMarkAsPending(todo){
        axios.put(`${URL}/${todo._id}`,{...todo, done: false})
            .then(resp => this.refresh(this.state.description))
    }

    handleSearch(){
        this.refresh(this.state.description)
    }

    handleClear(){
        this.refresh()

    }



    render() {
        return (
            <div>
                <PageHeader name='Tarefas' small='Cadastro'></PageHeader>
                <TodoForm 
                    description={this.state.description}
                    handleChange={this.handleChange}
                    handleAdd={this.handleAdd}
                    handleSearch={this.handleSearch}
                    handleClear={this.handleClear}
                 />
                <TodoList
                    list={this.state.list}

                    handleMarkAsDone={this.handleMarkAsDone}
                    handleMarkAsPending={this.handleMarkAsPending}
                    handleRemove={this.handleRemove}

                />
            </div>
        )
    }
}

