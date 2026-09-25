import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [clientes, setClientes] = useState([]);

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // -----------------------------
  // LISTAR CLIENTES
  // -----------------------------
  async function cargarClientes() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      return;
    }

    setClientes(data);
  }

  // -----------------------------
  // CARGAR AL INICIAR
  // -----------------------------
  useEffect(() => {
    cargarClientes();
  }, []);

  // -----------------------------
  // MANEJAR INPUTS
  // -----------------------------
  function handleChange(e) {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // -----------------------------
  // CREAR CLIENTE
  // -----------------------------
  async function crearCliente(e) {
    e.preventDefault();

    setMensaje('');
    setError('');

    if (!form.nombre || !form.apellido || !form.email) {
      setError('Completá nombre, apellido y email.');
      return;
    }

    const { error } = await supabase
      .from('clientes')
      .insert({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        telefono: form.telefono || null
      });

    if (error) {
      setError(error.message);
      return;
    }

    setMensaje('Cliente creado correctamente.');

    setForm({
      nombre: '',
      apellido: '',
      email: '',
      telefono: ''
    });

    await cargarClientes();
  }

  return (
    <div style={{ padding: '30px' }}>
      <h1>Tienda</h1>

      <h2>Nuevo cliente</h2>

      <form onSubmit={crearCliente}>
        <div>
          <label>Nombre</label>
          <br />
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Apellido</label>
          <br />
          <input
            type="text"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Teléfono</label>
          <br />
          <input
            type="text"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
          />
        </div>

        <br />

        <button type="submit">
          Crear cliente
        </button>
      </form>

      {mensaje && (
        <p style={{ color: 'green' }}>
          {mensaje}
        </p>
      )}

      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}

      <hr />

      <h2>Clientes registrados</h2>

      {clientes.length === 0 ? (
        <p>No hay clientes registrados.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
            </tr>
          </thead>

          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellido}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;