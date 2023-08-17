export function sorteByYears(arr: any) {
  const objetoOrdenado = [...arr].sort((a, b) => {
    // converte as strings em números para comparar
    const anoA = Number(a[0])
    const anoB = Number(b[0])

    // se anoA for maior que anoB, retorna um número negativo para colocar a antes de b
    if (anoA > anoB) {
      return -1
    }

    // se anoA for menor que anoB, retorna um número positivo para colocar b antes de a
    if (anoA < anoB) {
      return 1
    }

    // se anoA for igual a anoB, retorna zero para manter a ordem original
    return 0
  })
  return objetoOrdenado
}

const meses = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

export function sorteByMonths(data) {
  const objetoOrdenado = [...data].sort((a, b) => {
    // obtém o índice dos meses no array de meses
    const mesA = meses.indexOf(a[0])
    const mesB = meses.indexOf(b[0])

    // se mesA for maior que mesB, retorna um número negativo para colocar a antes de b
    if (mesA > mesB) {
      return -1
    }

    // se mesA for menor que mesB, retorna um número positivo para colocar b antes de a
    if (mesA < mesB) {
      return 1
    }

    // se mesA for igual a mesB, retorna zero para manter a ordem original
    return 0
  })
  return objetoOrdenado
}

export function defineProfiletext(
  profile: 'publisher' | 'baptized_publisher' | 'pioneer' | string,
) {
  if (profile === 'publisher') return 'Publicador'
  if (profile === 'baptized_publisher') return 'Batizado'
  if (profile === 'pioneer') return 'Pioneiro'
  return 'Perfil'
}
