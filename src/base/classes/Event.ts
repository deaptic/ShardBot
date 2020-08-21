import Bot from '../../client';

export default class Event extends Bot {
  constructor (public type = 'raw') {
    super();
  }
}
