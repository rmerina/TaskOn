       document.addEventListener('DOMContentLoaded', function() {
            // Sample tasks data
            const sampleTasks = [
                {
                    id: 1,
                    title: "Design homepage layout",
                    description: "Create wireframes for the new homepage design",
                    priority: "high",
                    dueDate: "2023-06-15",
                    status: "todo",
                    assignedTo: "John Doe"
                },
                {
                    id: 2,
                    title: "Write blog post",
                    description: "500-word article about productivity tips",
                    priority: "medium",
                    dueDate: "2023-06-18",
                    status: "todo",
                    assignedTo: "Jane Smith"
                },
                {
                    id: 3,
                    title: "Review analytics",
                    description: "Analyze website traffic from last month",
                    priority: "low",
                    dueDate: "2023-06-20",
                    status: "todo",
                    assignedTo: "Mike Johnson"
                },
                {
                    id: 4,
                    title: "Update social media",
                    description: "Post new content on Twitter and LinkedIn",
                    priority: "medium",
                    dueDate: "2023-06-16",
                    status: "in-progress",
                    assignedTo: "Sarah Williams"
                },
                {
                    id: 5,
                    title: "Team meeting",
                    description: "Weekly sync with marketing team",
                    priority: "low",
                    dueDate: "2023-06-14",
                    status: "done",
                    assignedTo: "John Doe"
                }
            ];
            
            // DOM elements
            const addTaskBtn = document.getElementById('add-task-btn');
            const taskModal = document.getElementById('task-modal');
            const closeModalBtn = document.getElementById('close-modal-btn');
            const cancelTaskBtn = document.getElementById('cancel-task-btn');
            const taskForm = document.getElementById('task-form');
            const priorityBtns = document.querySelectorAll('.priority-btn');
            const sidebarToggle = document.getElementById('sidebar-toggle');
            const sidebar = document.getElementById('sidebar');
            
            const todoColumn = document.getElementById('todo-column');
            const inProgressColumn = document.getElementById('in-progress-column');
            const doneColumn = document.getElementById('done-column');
            
            const taskMenu = document.getElementById('task-menu');
            const editTaskBtn = document.getElementById('edit-task-btn');
            const deleteTaskBtn = document.getElementById('delete-task-btn');
            const moveToProgressBtn = document.getElementById('move-to-progress-btn');
            const moveToDoneBtn = document.getElementById('move-to-done-btn');
            
            let selectedPriority = "medium";
            let tasks = [...sampleTasks];
            let currentTaskId = null;
            
            // Initialize the app
            function init() {
                renderTasks();
                setupEventListeners();
            }
            
            // Render all tasks
            function renderTasks() {
                todoColumn.innerHTML = '';
                inProgressColumn.innerHTML = '';
                doneColumn.innerHTML = '';
                
                tasks.forEach(task => {
                    const taskElement = createTaskElement(task);
                    
                    if (task.status === 'todo') {
                        todoColumn.appendChild(taskElement);
                    } else if (task.status === 'in-progress') {
                        inProgressColumn.appendChild(taskElement);
                    } else if (task.status === 'done') {
                        const doneElement = taskElement;
                        const checkboxContainer = doneElement.querySelector('.checkbox-container');
                        const checkmark = doneElement.querySelector('.checkmark');
                        
                        checkboxContainer.querySelector('input').checked = true;
                        checkmark.style.backgroundColor = '#6d28d9';
                        checkmark.style.borderColor = '#6d28d9';
                        
                        doneColumn.appendChild(doneElement);
                    }
                });
                
                updateTaskCounts();
                makeTasksDraggable();
            }
            
            // Create a task element
            function createTaskElement(task) {
                const priorityClasses = {
                    high: 'priority-high',
                    medium: 'priority-medium',
                    low: 'priority-low'
                };
                
                const priorityColors = {
                    high: 'text-red-500',
                    medium: 'text-yellow-500',
                    low: 'text-green-500'
                };
                
                const priorityIcons = {
                    high: 'fa-arrow-up',
                    medium: 'fa-equals',
                    low: 'fa-arrow-down'
                };
                
                const taskElement = document.createElement('div');
                taskElement.className = `task-acard bg-white rounded-lg border border-gray-200 p-4 ${priorityClasses[task.priority]} fade-in`;
                taskElement.setAttribute('data-task-id', task.id);
                taskElement.setAttribute('draggable', 'true');
                
                taskElement.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <div class="checkbox-container">
                            <label>
                                <input type="checkbox" ${task.status === 'done' ? 'checked' : ''}>
                                <span class="checkmark"></span>
                            </label>
                        </div>
                        <button class="task-menu-btn text-gray-400 hover:text-gray-600 relative">
                            <i class="fas fa-ellipsis-vertical"></i>
                        </button>
                    </div>
                    <h3 class="font-medium text-gray-800 mb-1">${task.title}</h3>
                    <p class="text-sm text-gray-600 mb-3">${task.description}</p>
                    <div class="flex items-center justify-between text-xs">
                        <div class="flex items-center ${priorityColors[task.priority]}">
                            <i class="fas ${priorityIcons[task.priority]} mr-1"></i>
                            <span>${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                        </div>
                        <div class="text-gray-500">
                            <i class="far fa-calendar mr-1"></i>
                            ${formatDate(task.dueDate)}
                        </div>
                    </div>
                    <div class="mt-3 flex items-center">
                        <div class="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                            <i class="fas fa-user text-purple-600 text-xs"></i>
                        </div>
                        <span class="ml-2 text-xs text-gray-600">${task.assignedTo}</span>
                    </div>
                `;
                
                // Add event listener to checkbox
                const checkbox = taskElement.querySelector('input[type="checkbox"]');
                checkbox.addEventListener('change', function() {
                    const taskId = parseInt(taskElement.getAttribute('data-task-id'));
                    const taskIndex = tasks.findIndex(t => t.id === taskId);
                    
                    if (this.checked) {
                        tasks[taskIndex].status = 'done';
                    } else {
                        tasks[taskIndex].status = 'todo';
                    }
                    
                    renderTasks();
                });
                
                // Add event listener to task menu button
                const menuBtn = taskElement.querySelector('.task-menu-btn');
                menuBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    currentTaskId = parseInt(taskElement.getAttribute('data-task-id'));
                    
                    // Position the menu
                    const rect = this.getBoundingClientRect();
                    taskMenu.style.top = `${rect.bottom}px`;
                    taskMenu.style.left = `${rect.left}px`;
                    
                    // Show the menu
                    taskMenu.classList.add('show');
                    
                    // Hide menu when clicking elsewhere
                    document.addEventListener('click', hideTaskMenu);
                });
                
                return taskElement;
            }
            
            // Hide task menu
            function hideTaskMenu() {
                taskMenu.classList.remove('show');
                document.removeEventListener('click', hideTaskMenu);
            }
            
            // Format date
            function formatDate(dateString) {
                const options = { month: 'short', day: 'numeric' };
                return new Date(dateString).toLocaleDateString('en-US', options);
            }
            
            // Update task counts in columns
            function updateTaskCounts() {
                const todoCount = tasks.filter(t => t.status === 'todo').length;
                const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
                const doneCount = tasks.filter(t => t.status === 'done').length;
                const totalCount = tasks.length;
                
                document.getElementById('todo-count').textContent = `${todoCount} ${todoCount === 1 ? 'task' : 'tasks'}`;
                document.getElementById('in-progress-count').textContent = `${inProgressCount} ${inProgressCount === 1 ? 'task' : 'tasks'}`;
                document.getElementById('done-count').textContent = `${doneCount} ${doneCount === 1 ? 'task' : 'tasks'}`;
                document.getElementById('total-tasks-count').textContent = `${totalCount} ${totalCount === 1 ? 'task' : 'tasks'} remaining`;
            }
            
            // Make tasks draggable
            function makeTasksDraggable() {
                const taskElements = document.querySelectorAll('.task-card');
                
                taskElements.forEach(task => {
                    task.addEventListener('dragstart', function(e) {
                        e.dataTransfer.setData('text/plain', this.getAttribute('data-task-id'));
                        setTimeout(() => {
                            this.classList.add('opacity-0');
                        }, 0);
                    });
                    
                    task.addEventListener('dragend', function() {
                        this.classList.remove('opacity-0');
                    });
                });
                
                const columns = [todoColumn, inProgressColumn, doneColumn];
                
                columns.forEach(column => {
                    column.addEventListener('dragover', function(e) {
                        e.preventDefault();
                        this.classList.add('drag-over');
                    });
                    
                    column.addEventListener('dragleave', function() {
                        this.classList.remove('drag-over');
                    });
                    
                    column.addEventListener('drop', function(e) {
                        e.preventDefault();
                        this.classList.remove('drag-over');
                        
                        const taskId = parseInt(e.dataTransfer.getData('text/plain'));
                        const taskIndex = tasks.findIndex(t => t.id === taskId);
                        
                        if (taskIndex !== -1) {
                            let newStatus = 'todo';
                            
                            if (this === inProgressColumn) {
                                newStatus = 'in-progress';
                            } else if (this === doneColumn) {
                                newStatus = 'done';
                            }
                            
                            tasks[taskIndex].status = newStatus;
                            renderTasks();
                        }
                    });
                });
            }
            
            // Setup event listeners
            function setupEventListeners() {
                // Modal controls
                addTaskBtn.addEventListener('click', () => {
                    taskModal.classList.remove('hidden');
                });
                
                closeModalBtn.addEventListener('click', () => {
                    taskModal.classList.add('hidden');
                });
                
                cancelTaskBtn.addEventListener('click', () => {
                    taskModal.classList.add('hidden');
                });
                
                // Sidebar toggle
                sidebarToggle.addEventListener('click', () => {
                    sidebar.classList.toggle('sidebar-collapsed');
                });
                
                // Priority selection
                priorityBtns.forEach(btn => {
                    btn.addEventListener('click', function() {
                        priorityBtns.forEach(b => {
                            b.classList.remove('bg-purple-50', 'border-purple-300', 'text-purple-700');
                            b.classList.add('hover:bg-gray-100');
                            
                            if (b.dataset.priority === 'low') {
                                b.classList.add('border-green-200', 'text-green-700', 'bg-green-50');
                            } else if (b.dataset.priority === 'medium') {
                                b.classList.add('border-yellow-200', 'text-yellow-700', 'bg-yellow-50');
                            } else if (b.dataset.priority === 'high') {
                                b.classList.add('border-red-200', 'text-red-700', 'bg-red-50');
                            }
                        });
                        
                        this.classList.remove('hover:bg-gray-100');
                        this.classList.add('bg-purple-50', 'border-purple-300', 'text-purple-700');
                        
                        if (this.dataset.priority === 'low') {
                            this.classList.remove('border-green-200', 'text-green-700', 'bg-green-50');
                        } else if (this.dataset.priority === 'medium') {
                            this.classList.remove('border-yellow-200', 'text-yellow-700', 'bg-yellow-50');
                        } else if (this.dataset.priority === 'high') {
                            this.classList.remove('border-red-200', 'text-red-700', 'bg-red-50');
                        }
                        
                        selectedPriority = this.dataset.priority;
                    });
                });
                
                // Form submission
                taskForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const title = document.getElementById('task-title').value;
                    const description = document.getElementById('task-description').value;
                    const dueDate = document.getElementById('task-due-date').value;
                    
                    if (!title) {
                        alert('Please enter a task title');
                        return;
                    }
                    
                    const newTask = {
                        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
                        title: title,
                        description: description,
                        priority: selectedPriority,
                        dueDate: dueDate || new Date().toISOString().split('T')[0],
                        status: 'todo',
                        assignedTo: 'John Doe'
                    };
                    
                    tasks.push(newTask);
                    renderTasks();
                    
                    // Reset form
                    this.reset();
                    priorityBtns[1].click(); // Reset to medium priority
                    taskModal.classList.add('hidden');
                });
                
                // Task menu actions
                editTaskBtn.addEventListener('click', function() {
                    const taskIndex = tasks.findIndex(t => t.id === currentTaskId);
                    if (taskIndex !== -1) {
                        const task = tasks[taskIndex];
                        
                        // Fill the form with task data
                        document.getElementById('task-title').value = task.title;
                        document.getElementById('task-description').value = task.description;
                        document.getElementById('task-due-date').value = task.dueDate;
                        
                        // Set priority
                        priorityBtns.forEach(btn => {
                            btn.classList.remove('bg-purple-50', 'border-purple-300', 'text-purple-700');
                            btn.classList.add('hover:bg-gray-100');
                            
                            if (btn.dataset.priority === 'low') {
                                btn.classList.add('border-green-200', 'text-green-700', 'bg-green-50');
                            } else if (btn.dataset.priority === 'medium') {
                                btn.classList.add('border-yellow-200', 'text-yellow-700', 'bg-yellow-50');
                            } else if (btn.dataset.priority === 'high') {
                                btn.classList.add('border-red-200', 'text-red-700', 'bg-red-50');
                            }
                            
                            if (btn.dataset.priority === task.priority) {
                                btn.classList.remove('hover:bg-gray-100');
                                btn.classList.add('bg-purple-50', 'border-purple-300', 'text-purple-700');
                                
                                if (btn.dataset.priority === 'low') {
                                    btn.classList.remove('border-green-200', 'text-green-700', 'bg-green-50');
                                } else if (btn.dataset.priority === 'medium') {
                                    btn.classList.remove('border-yellow-200', 'text-yellow-700', 'bg-yellow-50');
                                } else if (btn.dataset.priority === 'high') {
                                    btn.classList.remove('border-red-200', 'text-red-700', 'bg-red-50');
                                }
                            }
                        });
                        
                        selectedPriority = task.priority;
                        
                        // Change form to edit mode
                        taskForm.removeEventListener('submit', handleFormSubmit);
                        taskForm.addEventListener('submit', function(e) {
                            e.preventDefault();
                            
                            tasks[taskIndex].title = document.getElementById('task-title').value;
                            tasks[taskIndex].description = document.getElementById('task-description').value;
                            tasks[taskIndex].priority = selectedPriority;
                            tasks[taskIndex].dueDate = document.getElementById('task-due-date').value;
                            
                            renderTasks();
                            taskModal.classList.add('hidden');
                            taskForm.removeEventListener('submit', arguments.callee);
                            taskForm.addEventListener('submit', handleFormSubmit);
                        });
                        
                        // Show modal
                        taskModal.classList.remove('hidden');
                    }
                    
                    hideTaskMenu();
                });
                
                deleteTaskBtn.addEventListener('click', function() {
                    tasks = tasks.filter(t => t.id !== currentTaskId);
                    renderTasks();
                    hideTaskMenu();
                });
                
                moveToProgressBtn.addEventListener('click', function() {
                    const taskIndex = tasks.findIndex(t => t.id === currentTaskId);
                    if (taskIndex !== -1) {
                        tasks[taskIndex].status = 'in-progress';
                        renderTasks();
                    }
                    hideTaskMenu();
                });
                
                moveToDoneBtn.addEventListener('click', function() {
                    const taskIndex = tasks.findIndex(t => t.id === currentTaskId);
                    if (taskIndex !== -1) {
                        tasks[taskIndex].status = 'done';
                        renderTasks();
                    }
                    hideTaskMenu();
                });
                
                // Store original form submit handler
                const handleFormSubmit = taskForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                });
            }
            
            // Initialize the app
            init();
            document.getElementById('logout-btn').addEventListener('click', function () {
                window.location.href = "/login.html"; // Change to your login page
                });
            });
                

        
        