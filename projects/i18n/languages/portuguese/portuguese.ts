import {Language} from '@taiga-ui/i18n/interfaces';
import {TUI_PORTUGUESE_LANGUAGE_ADDON_COMMERCE} from './addon-commerce';
import {TUI_PORTUGUESE_LANGUAGE_ADDON_TABLE} from './addon-table';
import {TUI_PORTUGUESE_LANGUAGE_CORE} from './core';
import {TUI_PORTUGUESE_LANGUAGE_KIT} from './kit';

export const TUI_PORTUGUESE_LANGUAGE: Language = {
    ...TUI_PORTUGUESE_LANGUAGE_CORE,
    ...TUI_PORTUGUESE_LANGUAGE_KIT,
    ...TUI_PORTUGUESE_LANGUAGE_ADDON_TABLE,
    ...TUI_PORTUGUESE_LANGUAGE_ADDON_COMMERCE,
};
