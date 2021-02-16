import * as ts from 'typescript'
import {CONSTRUCTOR_NAME_SYMBOL_IDENTIFIER} from "./constants";

/**
 * CustomTransformer that associates constructor arguments with any given class declaration
 */
export function classNameTransformer(
    program: ts.Program
): ts.TransformerFactory<ts.SourceFile> {
    function transformer(context: ts.TransformationContext): ts.Transformer<ts.SourceFile> {
        return (sourceFile: ts.SourceFile): ts.SourceFile => {
            const visitor = (node: ts.Node): ts.Node | undefined => {
                if (ts.isClassLike(node)) {
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
                                    `Symbol.for("${CONSTRUCTOR_NAME_SYMBOL_IDENTIFIER}")`
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
                    if (ts.isClassDeclaration(node)) {
                        return context.factory.updateClassDeclaration(
                            node,
                            node.decorators,
                            node.modifiers,
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
