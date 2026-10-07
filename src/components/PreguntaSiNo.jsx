export default function PreguntaSiNo({ nombre, pregunta, valor, alCambiar, error }) {
  return (
    <fieldset aria-describedby={error ? `${nombre}-error` : undefined}>
      <legend className="fs-6 mb-2">{pregunta}</legend>
      {[
        { valor: 'si', texto: 'Sí' },
        { valor: 'no', texto: 'No' },
      ].map((opcion) => (
        <div className="form-check form-check-inline" key={opcion.valor}>
          <input
            className={`form-check-input${error ? ' is-invalid' : ''}`}
            type="radio"
            name={nombre}
            id={`${nombre}-${opcion.valor}`}
            value={opcion.valor}
            checked={valor === opcion.valor}
            onChange={alCambiar}
            required
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${nombre}-error` : undefined}
          />
          <label className="form-check-label" htmlFor={`${nombre}-${opcion.valor}`}>
            {opcion.texto}
          </label>
        </div>
      ))}
      {error && <div className="invalid-feedback d-block" id={`${nombre}-error`}>{error}</div>}
    </fieldset>
  );
}
