class TodoList {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.todoList = document.getElementById('todoList');
        this.todoForm = document.getElementById('todoForm');
        this.todoInput = document.getElementById('todoInput');
        this.filter = document.getElementById('filter');
        this.sort = document.getElementById('sort');

        this.initialize();
    }

    initialize() {
        this.todoForm.addEventListener('submit', this.addTodo.bind(this));
        this.filter.addEventListener('change', this.renderTodos.bind(this));
        this.sort.addEventListener('change', this.renderTodos.bind(this));
        this.renderTodos();
    }

    addTodo(e) {
        e.preventDefault();
        const text = this.todoInput.value.trim();
        
        if (text) {
            const newTodo = {
                id: Date.now(),
                text,
                completed: false,
                timestamp: new Date()
            };
            
            this.todos.unshift(newTodo);
            this.todoInput.value = '';
            this.saveTodos();
            this.renderTodos();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.renderTodos();
    }

    toggleComplete(id) {
        this.todos = this.todos.map(todo => 
            todo.id === id ? {...todo, completed: !todo.completed} : todo
        );
        this.saveTodos();
        this.renderTodos();
    }

    editTodo(id, newText) {
        this.todos = this.todos.map(todo => 
            todo.id === id ? {...todo, text: newText} : todo
        );
        this.saveTodos();
        this.renderTodos();
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    getFilteredTodos() {
        const filter = this.filter.value;
        return this.todos.filter(todo => {
            if (filter === 'completed') return todo.completed;
            if (filter === 'uncompleted') return !todo.completed;
            return true;
        });
    }

    getSortedTodos(todos) {
        const sort = this.sort.value;
        return todos.sort((a, b) => {
            switch(sort) {
                case 'newest': return b.timestamp - a.timestamp;
                case 'oldest': return a.timestamp - b.timestamp;
                case 'a-z': return a.text.localeCompare(b.text);
                case 'z-a': return b.text.localeCompare(a.text);
                default: return 0;
            }
        });
    }

    renderTodos() {
        const filteredTodos = this.getFilteredTodos();
        const sortedTodos = this.getSortedTodos([...filteredTodos]);
        
        this.todoList.innerHTML = '';
        
        sortedTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-item p-4 hover:bg-gray-50 transition-colors';
            li.innerHTML = `
                <div class="flex items-center gap-4">
                    <input 
                        type="checkbox" 
                        ${todo.completed ? 'checked' : ''}
                        class="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    >
                    <span class="flex-1 ${todo.completed ? 'completed' : ''}">${todo.text}</span>
                    <div class="flex gap-2">
                        <button class="text-blue-500 hover:text-blue-600 edit-btn">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-red-500 hover:text-red-600 delete-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;

            const checkbox = li.querySelector('input[type="checkbox"]');
            const deleteBtn = li.querySelector('.delete-btn');
            const editBtn = li.querySelector('.edit-btn');
            const textSpan = li.querySelector('span');

            checkbox.addEventListener('change', () => this.toggleComplete(todo.id));
            deleteBtn.addEventListener('click', () => this.animateRemove(li, todo.id));
            
            editBtn.addEventListener('click', () => {
                const newText = prompt('Edit tugas:', todo.text);
                if (newText !== null && newText.trim() !== '') {
                    this.editTodo(todo.id, newText.trim());
                }
            });

            this.todoList.appendChild(li);
        });
    }

    animateRemove(element, id) {
        element.classList.add('removing');
        setTimeout(() => {
            this.deleteTodo(id);
        }, 300);
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    new TodoList();
});