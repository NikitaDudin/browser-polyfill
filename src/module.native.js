import './window';
import './resize';
import './process';
import './console';

import Document from './DOM/Document';

window.document = window.document || new Document();
