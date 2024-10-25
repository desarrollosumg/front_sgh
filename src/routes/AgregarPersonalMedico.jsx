import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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

  const [departamentos, setDepartamentos] = useState([]); 
  const [especialidades, setEspecialidades] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate('/PersonalMedico'); // Redirige a la ruta 'PersonalMedico'
};

  // Función para cargar los departamentos
  const cargarDepartamentos = async () => {
    try {
      const response = await axios.get('http://localhost:8081/sgh/Departamentos');
      setDepartamentos(response.data);
    } catch (error) {
      console.error('Error al cargar los departamentos', error);
    }
    
  };

  // Función para cargar las especialidades
  const cargarEspecialidades = async () => {
    try {
      const response = await axios.get('http://localhost:8081/sgh/Especialidades');
      setEspecialidades(response.data);
    } catch (error) {
      console.error('Error al cargar las especialidades', error);
    }
  };

  useEffect(() => {
    // Obtener personal médico activo
    axios.get('http://localhost:8081/sgh/PersonalMedico')
      .then(response => {
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching personal medico:", error);
        setLoading(false);
      });

    // Obtener departamentos
    axios.get('http://localhost:8081/sgh/departamento')
      .then(response => {
        console.log("Departamentos:", response.data);  // Verificar si llegan los datos
        setDepartamentos(response.data);
      })
      .catch(error => {
        console.error("Error fetching departamentos:", error);
      });

    // Obtener especialidades
    axios.get('http://localhost:8081/sgh/especialidad')
      .then(response => {
        console.log("Especialidades:", response.data);  // Verificar si llegan los datos
        setEspecialidades(response.data);
      })
      .catch(error => {
        console.error("Error fetching especialidades:", error);
      });
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const insertarPersonalMedico = async () => {
    const fechaActual = new Date().toISOString(); // Fecha actual del sistema en formato ISO

    const nuevoPersonalMedico = {
      ...formData,
      usuarioCreacion: 1,  // Valor quemado
      fechaCreacion: fechaActual,  // Fecha actual
      usuarioModificacion: 1,  // Valor quemado
      fechaModificacion: fechaActual,  // Fecha actual
    };

    try {
      const response = await axios.post('http://localhost:8081/sgh/PersonalMedico', nuevoPersonalMedico);
      if (response.status === 201) {
        alert('Personal médico insertado correctamente');
      }
    } catch (error) {
      console.error('Error al insertar el personal médico', error);
      alert('Error al insertar el personal médico');
    }
  };

  const registrarBitacora = async () => {
    const fechaActual = new Date().toISOString(); // Fecha actual del sistema en formato ISO
    const bitacoraData = {
      accion: "INSERT",
      descripcion: "Creación de personal medico",
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

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Insertar Personal Médico</h2>
      <form onSubmit={(e) => { e.preventDefault(); insertarPersonalMedico(); }} style={styles.form}>
        {/* Primera sección del formulario */}
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

        {/* Segunda sección del formulario */}
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

// Estilos CSS-in-JS
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
    gap: '20px', // Espacio entre columnas
  },
  column: {
    width: '48%', // Para que cada columna ocupe el 48% del ancho, dejando espacio entre ellas
},
buttonRed: {
  padding: '6px 12px',
  borderRadius: '4px',
  backgroundColor: '#ff4d4d', // Color rojo
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  marginTop: '20px', // Espacio superior
},
};

export default InsertarPersonalMedico;
