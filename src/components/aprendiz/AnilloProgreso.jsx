function AnilloProgreso({ 
  porcentaje = 0, 
  tamaño = 80, 
  color = '#2e9a6e', 
  metrica = '',
  valorTexto = ''
}) {
  const radio = (tamaño / 2) - 10; // Ajuste para que el anillo no se corte
  const circunferencia = 2 * Math.PI * radio;
  const offset = circunferencia - (porcentaje / 100) * circunferencia;

  const porcentajeValido = typeof porcentaje === 'number' ? porcentaje : 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      width: '100%',
      maxWidth: tamaño + 20
    }}>
      <div style={{
        position: 'relative',
        width: tamaño,
        height: tamaño
      }}>
        <svg width={tamaño} height={tamaño} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={tamaño / 2}
            cy={tamaño / 2}
            r={radio}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="5"
          />
          <circle
            cx={tamaño / 2}
            cy={tamaño / 2}
            r={radio}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circunferencia}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
              filter: `drop-shadow(0 0 12px ${color}55)`
            }}
          />
        </svg>

        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '18px',
            fontWeight: '700',
            color: '#edf2f0'
          }}>
            {porcentajeValido}%
          </span>
        </div>
      </div>

      {metrica && (
        <div style={{
          textAlign: 'center',
          marginTop: '2px'
        }}>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: '600',
            color: '#edf2f0',
            display: 'block',
            lineHeight: '1.2'
          }}>
            {metrica}
          </span>
          {valorTexto && (
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: color,
              fontWeight: '500'
            }}>
              {valorTexto}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default AnilloProgreso;