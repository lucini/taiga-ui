import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    Inject,
    Input,
    OnInit,
    Optional,
    Self,
    ViewChild,
} from '@angular/core';
import {NgControl} from '@angular/forms';
import {TuiToolbarNewComponent} from '@taiga-ui/addon-editor/components/toolbar-new';
import {Editor, Extensions} from '@tiptap/core';
import {
    AbstractTuiControl,
    getClosestElement,
    TUI_FOCUSABLE_ITEM_ACCESSOR,
    TuiBooleanHandler,
    tuiDefaultProp,
} from '../../../cdk';
import {TuiEditor} from '../../abstract/editor-adapter.abstract';
import {TuiTiptapEditor} from '../../abstract/tiptap-editor';
import {defaultEditorTools} from '../../constants';
import {TUI_EDITOR_EXTENSIONS} from './editor-new.providers';

const EMPTY_PARAGRAPH = '<p></p>';

@Component({
    selector: 'tui-editor-new',
    templateUrl: './editor-new.component.html',
    styleUrls: ['./editor-new.style.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_FOCUSABLE_ITEM_ACCESSOR,
            useExisting: forwardRef(() => TuiEditorNewComponent),
        },
    ],
})
export class TuiEditorNewComponent extends AbstractTuiControl<string> implements OnInit {
    @Input()
    @tuiDefaultProp()
    exampleText = '';

    @ViewChild('editorRef', {static: true})
    elementRef?: ElementRef<HTMLElement>;

    @ViewChild(TuiToolbarNewComponent)
    toolbar?: TuiToolbarNewComponent;

    editor: Editor | null = null;
    editorAdapter!: TuiEditor;

    tools = defaultEditorTools;

    editorFocused = false;

    constructor(
        @Optional()
        @Self()
        @Inject(NgControl)
        control: NgControl | null,
        @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
        @Inject(TUI_EDITOR_EXTENSIONS) private readonly extensions: Extensions,
    ) {
        super(control, changeDetectorRef);
    }

    ngOnInit() {
        this.editor = new Editor({
            element: this.elementRef?.nativeElement,
            extensions: [...this.extensions],
        });

        this.editorAdapter = new TuiTiptapEditor(this.editor);

        this.editor?.on('update', () => {
            this.onModelChange(this.editor?.getHTML() || '');
        });

        this.editor?.on('transaction', () => {
            this.changeDetectorRef.markForCheck();
        });
    }

    protected getFallbackValue(): string {
        return '';
    }

    onAddLink() {}

    onRemoveLink() {}

    get focused(): boolean {
        return !!this.editor?.isFocused || (!!this.toolbar && this.toolbar.focused);
    }

    get dropdownSelectionHandler(): TuiBooleanHandler<any> {
        return () => true;
    }

    get placeholderRaised(): boolean {
        return (this.computedFocused && !this.readOnly) || this.hasValue;
    }

    get hasExampleText(): boolean {
        return (
            !!this.exampleText && this.computedFocused && !this.hasValue && !this.readOnly
        );
    }

    onHovered(hovered: boolean) {
        this.updateHovered(hovered);
    }

    onMouseDown(event: MouseEvent) {
        if (
            !(event.target instanceof Element) ||
            this.editor?.isFocused ||
            !!getClosestElement(event.target, 'button')
        ) {
            return;
        }

        event.preventDefault();
        this.editor?.chain().focus().run();
    }

    onModelChange(value: string) {
        this.updateValue(value.trim() === EMPTY_PARAGRAPH ? '' : value);
    }

    private get hasValue(): boolean {
        return !!this.value;
    }
}
