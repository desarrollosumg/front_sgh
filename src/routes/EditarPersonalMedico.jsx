import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditarPersonalMedico = () => {
    const { id } = useParams();
    const [medico, setMedico] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [departamentos, setDepartamentos] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);

    const handleRedirect = () => {
        navigate('/PersonalMedico');
    };

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [medicoResponse, departamentosResponse, especialidadesResponse] = await Promise.all([
                    axios.get(`http://localhost:8081/sgh/PersonalMedico/${id}`),
                    axios.get('http://localhost:8081/sgh/departamento'),
                    axios.get('http://localhost:8081/sgh/especialidad'),
                ]);

                setMedico(medicoResponse.data);
                setDepartamentos(departamentosResponse.data);
                setEspecialidades(especialidadesResponse.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        cargarDatos();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMedico((prevMedico) => ({
            ...prevMedico,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8081/sgh/PersonalMedico/${id}`, {
                ...medico,
                usuarioModificacion: 1,
                fechaModificacion: new Date().toISOString(),
            });

            await registrarBitacora();
            navigate('/personalMedico');
        } catch (error) {
            console.error("Error updating medico:", error);
        }
    };

    const registrarBitacora = async () => {
        const fechaActual = new Date().toISOString();
        const bitacoraData = {
            accion: "UPDATE",
            descripcion: "Actualización de personal médico",
            modulo: 1,
            usuario: 1,
            ip: "192.168.0.1",
            fecha: fechaActual
        };

        try {
            await axios.post('http://localhost:8081/sgh/bitacora', bitacoraData);
            console.log('Registro en bitácora insertado correctamente');
        } catch (error) {
            console.error('Error al registrar en bitácora', error);
        }
    };

    if (loading) {
        return <p>Cargando datos...</p>;
    }

    if (!medico) {
        return <p>No se encontró el médico.</p>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Editar Personal Médico</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.columnsContainer}>
                    <div style={styles.column}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Nombre:</label>
                            <input
                                type="text"
                                name="nombre"
                                value={medico.nombre}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Apellido:</label>
                            <input
                                type="text"
                                name="apellido"
                                value={medico.apellido}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Fecha de Nacimiento:</label>
                            <input
                                type="datetime-local"
                                name="fechaNacimiento"
                                value={new Date(medico.fechaNacimiento).toISOString().slice(0, 16)}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Género:</label>
                            <select
                                name="genero"
                                value={medico.genero}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            >
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Teléfono:</label>
                            <input
                                type="text"
                                name="telefono"
                                value={medico.telefono}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                    </div>
                    <div style={styles.column}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Correo:</label>
                            <input
                                type="email"
                                name="correo"
                                value={medico.correo}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Fecha de Contratación:</label>
                            <input
                                type="datetime-local"
                                name="fechaContratacion"
                                value={new Date(medico.fechaContratacion).toISOString().slice(0, 16)}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Departamento:</label>
                            <select
                                name="departamentoId"
                                value={medico.departamentoId} // Cambiado de formData a medico
                                onChange={handleChange}
                                style={styles.input}
                                required
                            >
                                <option value="">Selecciona un Departamento</option>
                                {departamentos.map(departamento => (
                                    <option key={departamento.id} value={departamento.id}>
                                        {departamento.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Especialidad:</label>
                            <select
                                name="especialidadId"
                                value={medico.especialidadId} // Cambiado de formData a medico
                                onChange={handleChange}
                                style={styles.input}
                                required
                            >
                                <option value="">Selecciona una Especialidad</option>
                                {especialidades.map(especialidad => (
                                    <option key={especialidad.id} value={especialidad.id}>
                                        {especialidad.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Estado:</label>
                            <select
                                name="estado"
                                value={medico.estado}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            >
                                <option value={1}>Activo</option>
                                <option value={0}>Inactivo</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button type="submit" style={styles.button}>Guardar Cambios</button>
                <button type="button" style={styles.buttonRed} onClick={handleRedirect}>Cerrar</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '20px',
    },
    title: {
        color: '#6482AD',
        fontWeight: 'bold',
        fontSize: '36px',
        marginBottom: '20px',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '600px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        marginBottom: '5px',
        fontSize: '14px',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px',
    },
    button: {
        backgroundColor: '#6482AD',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    buttonRed: {
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    columnsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    column: {
        flex: 1,
        marginRight: '10px',
    },
};

export default EditarPersonalMedico;
