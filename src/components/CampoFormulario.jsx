export default function CampoFormulario({
  nombre, etiqueta, valor, alCambiar, error, tipo = 'text', ayuda, ...atributos
}) {
  const descripcion = [ayuda && `${nombre}-ayuda`, error && `${nombre}-error`]
    .filter(Boolean).join(' ') || undefined;

  return (
    <div>
      <label className="form-label" htmlFor={nombre}>{etiqueta}</label>
      <input
        {...atributos}
        id={nombre}
        name={nombre}
        type={tipo}
        className={`form-control${error ? ' is-invalid' : ''}`}
        value={valor}
        onChange={alCambiar}
        required
        aria-invalid={Boolean(error)}
        aria-describedby={descripcion}
      />
      {ayuda && <div className="form-text" id={`${nombre}-ayuda`}>{ayuda}</div>}
      {error && <div className="invalid-feedback" id={`${nombre}-error`}>{error}</div>}
    </div>
  );
}
