import { RemoteRService } from './remote-r.service';

describe('With running OpenCPU server, RemoteRService', () => {
  it('should throw error when not able to connect', () => {
    expect(() => new RemoteRService()).toThrowError();
  });
});
