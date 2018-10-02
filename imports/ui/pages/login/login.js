import { Template } from 'meteor/templating';

import './login.html';

// JS for Login template override
Template['override-atPwdFormBtn'].replaces('atPwdFormBtn');
