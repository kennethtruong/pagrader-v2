import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import createMiddleware from './middleware/clientMiddleware';
import reducer from './modules/reducer';

const isProd = process.env.NODE_ENV === 'production';

export default function createStore(client, data) {
  const middleware = [createMiddleware(client)];

  let finalCreateStore;
  if (!isProd) {
    const enhancers = [];
    if (window.devToolsExtension) {
      enhancers.push(window.devToolsExtension());
    }

    finalCreateStore = compose(applyMiddleware(...middleware), ...enhancers)(
      _createStore
    );
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  const store = finalCreateStore(reducer, data);

  return store;
}
