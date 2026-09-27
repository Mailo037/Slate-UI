import React, { forwardRef, useEffect, useId } from 'react';
import SlateUI from './slate.js';
const classes = (...values) => values.filter(Boolean).join(' ');
export function useSlateUI(ref) { useEffect(() => { const root = ref ? ref.current : document; if (root) return SlateUI.init(root); }, [ref]); }
export const Button = forwardRef(function Button({ variant, size, tooltip, className, type='button', ...props }, ref) { return React.createElement('button', { ...props, ref, type, className:classes('sl-btn', variant, size, className), 'data-sl-tooltip':tooltip }); });
export const Input = forwardRef(function Input({ className, ...props }, ref) { return React.createElement('input', { ...props, ref, className:classes('sl-input', className) }); });
export const Icon = forwardRef(function Icon({ name, className, ...props }, ref) { return React.createElement('svg', { ...props, ref, className:classes('sl-icon',className), 'data-sl-icon':name, 'aria-hidden':true, focusable:false }); });
export function Field({ label, hint, children, className }) { const id=useId(); const child=React.isValidElement(children) ? React.cloneElement(children, { id:children.props.id || id }) : children; return React.createElement('label', { className:classes('sl-field',className) }, label, child, hint && React.createElement('small',null,hint)); }
export const Panel = forwardRef(function Panel({ className, ...props }, ref) { return React.createElement('section',{...props,ref,className:classes('sl-panel',className)}); });
export const HoverList = forwardRef(function HoverList({ className, ...props }, ref) { return React.createElement('div',{...props,ref,className,'data-sl-hover':''}); });
export const MenuRow = forwardRef(function MenuRow({ className, ...props }, ref) { return React.createElement('button',{type:'button',...props,ref,className:classes('sl-menu-row',className),'data-sl-row':''}); });
export function Status({ tone, className, children, ...props }) { return React.createElement('span',{...props,className:classes('sl-status',tone,className)},children); }
