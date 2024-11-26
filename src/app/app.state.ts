import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

export interface AppStateModel {
  sessionId: string | null;
  loaderEventCount: number;
}

/**********Actions *******/
export class UpdateSessionId {
  static readonly type = '[AppState] UpdateSessionId';
  constructor(public sessionId: string | null) {}
}
export class StartAppLoader {
  static readonly type = '[StartAppLoader] StartAppLoader';
}
export class StopAppLoader {
  static readonly type = '[StopAppLoader] StopAppLoader';
}

@State<AppStateModel>({
  name: 'eluiappstate',
  defaults: {
    sessionId: null,
    loaderEventCount: 0,
  },
})
@Injectable()
export class AppState {
  @Selector()
  static sessionId(appStateModel: AppStateModel) {
    return appStateModel.sessionId;
  }

  @Selector()
  static isLoading(appStateModel: AppStateModel) {
    return appStateModel.loaderEventCount > 0;
  }

  @Action(UpdateSessionId)
  updateSessionId(ctx: StateContext<AppStateModel>, action: UpdateSessionId) {
    ctx.patchState({ sessionId: action.sessionId });
  }

  @Action(StartAppLoader)
  startAppLoader(ctx: StateContext<AppStateModel>) {
    const count = ctx.getState().loaderEventCount;
    ctx.setState(patch({ loaderEventCount: count + 1 }));
  }

  @Action(StopAppLoader)
  stopAppLoader(ctx: StateContext<AppStateModel>) {
    const count = ctx.getState().loaderEventCount;
    ctx.setState(patch({ loaderEventCount: count - 1 }));
  }
}
