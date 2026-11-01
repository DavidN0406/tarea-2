// Muestra la cantidad de resultados en cada estado

function ResumenLecturas({ conteos }) {
    return (
        <section className="resumen-lecturas">
            <h3>Resumen de resultados</h3>

            <dl className="resumen-conteos">
                {conteos.map(function (conteo) {
                    return (
                        <div
                            className="resumen-item"
                            key={conteo.estado}
                        >
                            <dt>{conteo.estado}</dt>

                            <dd className="resumen-cantidad">
                                {conteo.cantidad}
                            </dd>
                        </div>
                    )
                })}
            </dl>
        </section>
    )
}

export default ResumenLecturas