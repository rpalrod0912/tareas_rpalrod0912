import React from 'react'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

const App = () => {
    const tareasInitialState = JSON.parse(localStorage.getItem('tareas')) || []
    const tareaInitialState = {
        nombre: '',
        descripcion: '',
        estado: false,
        prioridad: false,
    }
    const [tareas, setTareas] = useState(tareasInitialState)
    const [tarea, setTarea] = useState(tareaInitialState)

    // Funciones
    const handleonDragEnd = result => {
        const { destination, source } = result
        if (!destination) return
        const startIndex = source.index
        const endIndex = destination.index

        reorder(startIndex, endIndex)
    }

    const reorder = (startIndex, endIndex) => {
        const result = [...tareas]
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)
        setTareas(result)
    }
    const agregarTarea = e => {
        e.preventDefault()
        if (!tarea.nombre.trim()) {
            e.target[0].focus()
            Swal.fire({
                title: 'Error',
                text: 'El campo nombre es obligatorio',
                icon: 'error',
            })
            return
        }
        if (!tarea.descripcion.trim()) {
            e.target[1].focus()
            Swal.fire({
                title: 'Error',
                text: 'El campo descripción es obligatorio',
                icon: 'error',
            })
            return
        }
        Swal.fire({
            title: 'Éxito',
            text: 'Tarea agregada con éxito',
            icon: 'success',
        })
        setTareas([...tareas, tarea])
        setTarea(tareaInitialState)
    }

    const eliminarTarea = id => {
        setTareas(tareas.filter(item => item.id !== id))
    }

    const finalizarTarea = id => {
        setTareas(
            tareas.map(item =>
                item.id === id ? { ...item, estado: !item.estado } : item
            )
        )
    }

    const handleChange = e => {
        setTarea({
            ...tarea,
            [e.target.name]:
                e.target.type === 'checkbox'
                    ? e.target.checked
                    : e.target.value,
            id: Date.now(),
        })
    }

    useEffect(() => {
        localStorage.setItem('tareas', JSON.stringify(tareas))
    }, [tareas])

    return (
        <div className='container mt-4'>
            <h1 className='text-center'>Tareas App</h1>
            <hr />
            <div className='row mt-2'>
                <div className='col-8'>
                    <DragDropContext onDragEnd={handleonDragEnd}>
                        <h4 className='text-center'>Lista tareas</h4>
                        <Droppable droppableId='droppable-1'>
                            {droppableProvided => (
                                <ul
                                    className='class="list-group'
                                    ref={droppableProvided.innerRef}
                                    {...droppableProvided.droppableProps}
                                >
                                    {tareas.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={`${item.id}`}
                                            index={index}
                                        >
                                            {dragableProvided => (
                                                <li
                                                    key={index}
                                                    className='list-group-item d-flex justify-content-between'
                                                    ref={
                                                        dragableProvided.innerRef
                                                    }
                                                    {...dragableProvided.draggableProps}
                                                    {...dragableProvided.dragHandleProps}
                                                >
                                                    <div
                                                        className={
                                                            item.estado
                                                                ? 'text-decoration-line-through'
                                                                : ''
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                item.prioridad
                                                                    ? 'fw-bold  d-flex align-items-start text-danger'
                                                                    : 'fw-bold  d-flex align-items-start'
                                                            }
                                                        >
                                                            {item.nombre}
                                                        </div>
                                                        <p>
                                                            {item.descripcion}
                                                        </p>
                                                    </div>

                                                    <div className='d-flex justify-content-end align-items-center'>
                                                        <button
                                                            type='button'
                                                            className='btn btn-secondary me-2 btn-sm float-end'
                                                            onClick={() =>
                                                                finalizarTarea(
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            {item.estado
                                                                ? 'Activar'
                                                                : 'Finalizar'}
                                                        </button>
                                                        <button className='btn btn-warning me-2 btn-sm float-end'>
                                                            Editar
                                                        </button>
                                                        <button
                                                            className='btn btn-danger me-2 btn-sm float-end'
                                                            onClick={e =>
                                                                eliminarTarea(
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {droppableProvided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
                <div className='col-4'>
                    <h4 className='text-center'>Agregar tareas</h4>
                    <form onSubmit={agregarTarea}>
                        <input
                            name='nombre'
                            type='text'
                            className='form-control mb-2'
                            placeholder='Introduce el nombre de la tarea'
                            onChange={e => handleChange(e)}
                            value={tarea.nombre}
                        />
                        <textarea
                            name='descripcion'
                            type='text'
                            className='form-control mb-2'
                            placeholder='Introduce la descripción de la tarea'
                            onChange={e => handleChange(e)}
                            value={tarea.descripcion}
                        />
                        {/* <select
              name='estado'
              className='form-control mb-2'
              onChange={e => handleChange(e)}
              value={tarea.estado}
            >
              <option value='pendiente'>Pendiente</option>
              <option value='completada'>Completada</option>
            </select> */}

                        <div className='form-check mb-2'>
                            <input
                                className='form-check-input'
                                type='checkbox'
                                name='prioridad'
                                checked={tarea.prioridad}
                                onChange={e => handleChange(e)}
                            />
                            <label
                                className='form-check-label'
                                htmlFor='flexCheckDefault'
                            >
                                Prioridad
                            </label>
                        </div>
                        <button className='btn btn-dark w-100 mt-2'>
                            Agregar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default App
