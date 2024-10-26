import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const InsertarPersonalMedico = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    genero: "",
    telefono: "",
    correo: "",
    fechaContratacion: "",
    departamentoId: "",
    especialidadId: "",
    estado: 0
  });

  const url = process.env.REACT_APP_API_BASE_URL;
  const [departamentos, setDepartamentos] = useState([]); 
  const [especialidades, setEspecialidades] = useState([]); 
  const [usuarioId, setUsuarioId]= useState();
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate('/PersonalMedico'); 
};


  useEffect(() => {
    setUsuarioId(localStorage.getItem(`userId`))
    axios.get(`${url}/departamento`)
      .then(response => {
        setDepartamentos(response.data);
      })
      .catch(error => {
        console.error("Error fetching departamentos:", error);
      });

    axios.get(`${url}/especialidad`)
      .then(response => {
        setEspecialidades(response.data);
      })
      .catch(error => {
        console.error("Error fetching especialidades:", error);
      });
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "nombre" || name === "apellido") {
      const regex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!regex.test(value)) return;
    }
    
    if (name === "telefono") {
      const regex = /^[0-9]{0,8}$/;
      if (!regex.test(value)) return;
    }
  
    if (name === "correo") {
      setFormData({
        ...formData,
        [name]: value,
      });
      return;
    }
  
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const insertarPersonalMedico = async () => {
    const fechaActual = new Date().toISOString(); 

    const nuevoPersonalMedico = {
      ...formData,
      usuarioCreacion: usuarioId,  
      fechaCreacion: fechaActual,  
      usuarioModificacion: usuarioId,  
      fechaModificacion: fechaActual,  
    };

    if (formData.telefono.length !== 8) {
      await Swal.fire({
        icon: 'error',
        title: 'Teléfono inválido',
        text: 'El teléfono debe contener exactamente 8 dígitos.',
      });
      return;
    }
    const correoRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!correoRegex.test(formData.correo)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Por favor ingresa un correo válido.',
      });
      return;
    }

    try {
      const response = await axios.post(`${url}/PersonalMedico`, nuevoPersonalMedico);
      if (response.status === 201) {
        await Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Personal Medico registrado con éxito!',
      });
      await registrarBitacora();
      navigate('/PersonalMedico'); 
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al registrar el Personal Medico. Inténtalo nuevamente.',
    });
    }
  };

  const registrarBitacora = async () => {
    const fechaActual = new Date().toISOString();
    const bitacoraData = {
        accion: "INSERT",
        descripcion: "Se agrego un nuevo registro de personal médico",
        modulo: 4,
        usuario: usuarioId,
        fecha: fechaActual
    };

    try {
        await axios.post(`${url}/bitacora`, bitacoraData);
    } catch (error) {
        console.error('Error al registrar en bitácora', error);
    }
};

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Insertar Personal Médico</h2>
      <form onSubmit={(e) => { e.preventDefault(); insertarPersonalMedico(); }} style={styles.form}>
        <h3>Información Personal</h3>
        <div style={styles.columnsContainer}>
          <div style={styles.column}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
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
                value={formData.apellido}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Fecha de Nacimiento:</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Género:</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Selecciona</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
          </div>

          <div style={styles.column}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Teléfono:</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Correo:</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>
        </div>

        <h3>Detalles del Trabajo</h3>
        <div style={styles.columnsContainer}>
          <div style={styles.column}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Fecha de Contratación:</label>
              <input
                type="date"
                name="fechaContratacion"
                value={formData.fechaContratacion}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Departamento:</label>
              <select
                name="departamentoId"
                value={formData.departamentoId}
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
          </div>

          <div style={styles.column}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Especialidad:</label>
              <select
                name="especialidadId"
                value={formData.especialidadId}
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
                value={formData.estado}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="0">Inactivo</option>
                <option value="1">Activo</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" style={styles.button}>Guardar Cambios</button>
        <button style={styles.buttonRed} onClick={handleRedirect}> Cerrar</button>
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
  },
  title: {
    textAlign: "center",
    padding: "10px",
    color: "#6482AD",
    fontWeight: "bold",
    fontSize: "36px"
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
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  button: {
    padding: '6px 12px',
    borderRadius: '4px',
    backgroundColor: '#6482AD',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  columnsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px', 
  },
  column: {
    width: '48%', 
},
buttonRed: {
  padding: '6px 12px',
  borderRadius: '4px',
  backgroundColor: '#ff4d4d', 
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  marginTop: '20px', 
},
};

export default InsertarPersonalMedico;
