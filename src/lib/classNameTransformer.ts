import * as ts from 'typescript'
import { Injector } from 'plume-ts-di';

/**
 * CustomTransformer that associates constructor arguments with any given class declaration
 */
export function classNameTransformer(): ts.TransformerFactory<ts.SourceFile> {
    function transformer(context: ts.TransformationContext): ts.Transformer<ts.SourceFile> {
        return (sourceFile: ts.SourceFile): ts.SourceFile => {
            const visitor = (node: ts.Node): ts.Node | undefined => {
                if (ts.isClassLike(node)) {
                    if (ts.isClassDeclaration(node)) {
                        const updatedClassMembers: readonly ts.ClassElement[] = [
                            ...(node.members),
                            context.factory.createGetAccessorDeclaration(
                                undefined,
                                [
                                    context.factory.createModifier(ts.SyntaxKind.PublicKeyword),
                                    context.factory.createModifier(ts.SyntaxKind.StaticKeyword),
                                ],
                                context.factory.createComputedPropertyName(
                                    context.factory.createIdentifier(
                                        `Symbol.for("${Injector.CONSTRUCTOR_NAME_SYMBOL_IDENTIFIER}")`
                                    )
                                ),
                                [],
                                undefined,
                                context.factory.createBlock([
                                    context.factory.createReturnStatement(
                                        context.factory.createStringLiteral(node.name ? node.name.getFullText().trim() : 'undefined')
                                    ),
                                ])
                            ),
                        ];

                        return context.factory.updateClassDeclaration(
                            node,
                            node.decorators,
                            node.modifiers?.filter(ts.isModifier),
                            node.name,
                            node.typeParameters,
                            node.heritageClauses,
                            updatedClassMembers
                        );
                    }

                }
                return ts.visitEachChild(node, visitor, context);
            };

            return ts.visitNode(sourceFile, visitor);
        };
    }

    return transformer;
}
