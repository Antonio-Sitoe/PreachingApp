import type { IReport } from '@/database/actions';
import { minutesToHoursAndMinutes } from './dates';
import dayjs from 'dayjs';

export function sorteByYears(arr: any) {
  const objetoOrdenado = [...arr].sort((a, b) => {
    // converte as strings em números para comparar
    const anoA = Number(a[0]);
    const anoB = Number(b[0]);

    // se anoA for maior que anoB, retorna um número negativo para colocar a antes de b
    if (anoA > anoB) {
      return -1;
    }

    // se anoA for menor que anoB, retorna um número positivo para colocar b antes de a
    if (anoA < anoB) {
      return 1;
    }

    // se anoA for igual a anoB, retorna zero para manter a ordem original
    return 0;
  });
  return objetoOrdenado;
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
];

export function sorteByMonths(data) {
  const objetoOrdenado = [...data].sort((a, b) => {
    // obtém o índice dos meses no array de meses
    const mesA = meses.indexOf(a[0]);
    const mesB = meses.indexOf(b[0]);

    // se mesA for maior que mesB, retorna um número negativo para colocar a antes de b
    if (mesA > mesB) {
      return -1;
    }

    // se mesA for menor que mesB, retorna um número positivo para colocar b antes de a
    if (mesA < mesB) {
      return 1;
    }

    // se mesA for igual a mesB, retorna zero para manter a ordem original
    return 0;
  });
  return objetoOrdenado;
}

export function sortByMonthAscending(monthsArray) {
  return monthsArray.sort((a, b) => {
    // Se month é string (nome do mês), converte para número
    const monthA =
      typeof a.month === 'string'
        ? meses.indexOf(a.month.toLowerCase()) + 1
        : a.month;
    const monthB =
      typeof b.month === 'string'
        ? meses.indexOf(b.month.toLowerCase()) + 1
        : b.month;

    if (monthA < monthB) {
      return -1;
    } else if (monthA > monthB) {
      return 1;
    } else {
      return 0;
    }
  });
}

export function defineProfiletext(
  profile: 'publisher' | 'baptized_publisher' | 'pioneer' | string
) {
  if (profile === 'publisher') return 'Publicador';
  if (profile === 'baptized_publisher') return 'Batizado';
  if (profile === 'pioneer') return 'Pioneiro';
  return '';
}

export function capitalizeString(inputString: string) {
  if (inputString)
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
  else return '';
}

export function monthNumberToName(monthNumber: number): string {
  if (monthNumber >= 1 && monthNumber <= 12) {
    return meses[monthNumber - 1];
  }
  return '';
}

export function monthNameToNumber(monthName: string): number {
  const index = meses.indexOf(monthName.toLowerCase());
  return index >= 0 ? index + 1 : 0;
}

export function sortByYearMonthDay(data: any) {
  return data.sort((a, b) => {
    // Ordena por ano em ordem decrescente
    if (a.year !== b.year) {
      return b.year - a.year;
    }

    // Ordena por mês em ordem decrescente
    // Se month é string (nome do mês), converte para número
    const monthA =
      typeof a.month === 'string'
        ? meses.indexOf(a.month.toLowerCase()) + 1
        : a.month;
    const monthB =
      typeof b.month === 'string'
        ? meses.indexOf(b.month.toLowerCase()) + 1
        : b.month;

    if (monthA !== monthB) {
      return monthB - monthA;
    }

    // Ordena por dia em ordem decrescente
    return b.day - a.day;
  });
}

export function group_list_into_chunks(reportsFiltered: IReport[]) {
  const data: IReport = reportsFiltered.reduce(
    (acc: any, state: any) => {
      const oldState = state._raw || state;
      acc.hours += oldState.hours || 0;
      acc.minutes += oldState.minutes || 0;
      acc.students += oldState.students || 0;
      // Mantém o comentário do último relatório ou concatena
      if (oldState.comments) {
        acc.comments = acc.comments
          ? `${acc.comments}; ${oldState.comments}`
          : oldState.comments;
      }
      return acc;
    },
    {
      hours: 0,
      minutes: 0,
      students: 0,
      comments: '',
      time: '',
    }
  );
  data.time = minutesToHoursAndMinutes(data.hours, data.minutes);
  return data;
}
export const best = {
  hours: {
    value: 0,
    month: '',
  },
  students: {
    value: 0,
    month: '',
  },
};
export function bestMonthsStatics(data: any) {
  for (const iterator of data) {
    const [h] = String(iterator.reports.time).split(':');
    console.log(h);

    if (Number(h) > best.hours.value) {
      best.hours.value = Number(h);
      best.hours.month = iterator.month;
    }
    if (iterator.reports.students > best.students.value) {
      best.students.value = iterator.reports.students;
      best.students.month = iterator.month;
    }
  }
  return best;
}

export function cortarString(descricao, limite = 25) {
  if (descricao.length <= limite) {
    return descricao;
  } else {
    return `${descricao.slice(0, limite)}...`;
  }
}

export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export function removeProperty<T extends object, K extends keyof T>(
  obj: T,
  properties: K | K[]
): Omit<T, K> {
  let result = { ...obj } as Omit<T, K>;

  if (Array.isArray(properties)) {
    for (const property of properties) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [property]: _, ...rest } = result;
      result = rest as Omit<T, K>;
    }
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [properties]: _, ...rest } = result;
    result = rest as Omit<T, K>;
  }

  return result as Omit<T, K>;
}

export function formatDate(date: string) {
  const [day, month, year] = date.split('/');
  const formattedDate = `${year}-${month}-${day}`;
  return dayjs(formattedDate)
    .locale('pt-br')
    .format('dddd, D [de] MMMM [de] YYYY');
}
