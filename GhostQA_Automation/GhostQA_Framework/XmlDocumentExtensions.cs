﻿using System.Xml;

namespace GhostQA_Framework
{
    public static class XmlDocumentExtensions
    {
        public static void Redact(this XmlDocument xmlDoc, string tagName)
        {
            XmlNodeList matchingNodes = xmlDoc.GetElementsByTagName(tagName);

            foreach (XmlNode node in matchingNodes)
            {
                node.InnerText = "******";
            }
        }
    }
}